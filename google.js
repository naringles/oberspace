path = require("path");
moment = require("moment");
fs = require("fs");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const { google } = require("googleapis");
const readline = require("readline");
common = require("./common");

const driveSchema = require("./models/Drives");
const folderSchema = require("./models/Folder");
const fileSchema = require("./models/Files");

const User = require("./models/User");
const Drive = new mongoose.model("Drive", driveSchema);
const Folder = new mongoose.model("Folder", folderSchema);
const File = new mongoose.model("File", fileSchema);
// let newFilesReceived=false;

async function getOAuthClient() {
  return new google.auth.OAuth2(
    process.env.client_id,
    process.env.client_secret,
    process.env.redirect_uris
  );
}

oauth2Client = new google.auth.OAuth2(
  process.env.client_id,
  process.env.client_secret,
  process.env.redirect_uris
);

const scopes = [
  "https://www.googleapis.com/auth/drive",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
];

const authorizationUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  scope: scopes,
  include_granted_scopes: true,
});

const getProfile = async (auth) => {
  var oauth2 = google.oauth2({ auth: auth, version: "v2" });
  const { data } = await oauth2.userinfo.v2.me.get();
  return data;
};

const getMeta = async (auth) => {
  try {
    var drive = google.drive({ version: "v3", auth });
    var meta = await drive.about.get({ fields: "storageQuota,user" });
    return meta.data;
  } catch (error) {
    console.log("google get meta" + error);
    return null;
  }
};

const fetchFilesGoogle = async (email, query, drive, socketId) => {
  let oAuth2Client = await getOAuthClient();
  oAuth2Client.setCredentials({ refresh_token: drive.refreshToken });
  await createDefaultFolders(oAuth2Client, email, drive.id);
  listFiles(oAuth2Client, drive.id, email, query, false, socketId).then(
    async (response) => {
      if (response === "yes") {
        let { storageQuota } = await getMeta(oAuth2Client);
        let driveUsgPct = (storageQuota.usage / storageQuota.limit) * 100;
        driveUsgPct = Math.round((driveUsgPct + Number.EPSILON) * 100) / 100;
        User.updateOne(
          { email: email, "drives.id": drive.id },
          {
            $set: {
              "drives.$.storageUsage": storageQuota.usage,
              "drives.$.storageUsageInDrive": storageQuota.usageInDrive,
              "drives.$.storageUsageInDriveTrash":
                storageQuota.usageInDriveTrash,
              "drives.$.storageUsagePct": driveUsgPct,
            },
          }
        ).then(() => {
          if (typeof newFilesReceived !== undefined) {
            User.findOne(
              { email: email, "drives.id": drive.id },
              { "drives.$": 1 }
            )
              .then((driveItems) => {
                if (typeof socketId !== undefined) {
                  io.sockets.connected[socketId].emit("googleFiles", {
                    driveId: driveItems.drives[0].id,
                    storageEmail: driveItems.drives[0].email,
                    storageLimit: driveItems.drives[0].storageLimit,
                    storageUsage: driveItems.drives[0].storageUsage,
                    storageUsagePct: driveItems.drives[0].storageUsagePct,
                    files: driveItems.drives[0].files,
                  });
                }
              })
              .then(() => {
                newFilesReceived = false;
              })
              .catch((err) =>
                console.log("google fetch file: error in emitting data :", err)
              );
          }
        });
      }
    }
  );
};

const createDefaultFolders = async (auth, email, driveId) => {
  const drive = google.drive({ version: "v3", auth });

  common.FolderNames.map(async (folderName) => {
    let query =
      "mimeType = 'application/vnd.google-apps.folder' and trashed = false and name = '" +
      folderName +
      "'";

    getList(drive, "", [], query).then(async (files) => {
      if (files.length === 0 || files[0].name !== folderName) {
        var fileMetadata = {
          name: folderName,
          mimeType: "application/vnd.google-apps.folder",
        };
        drive.files.create(
          { resource: fileMetadata, fields: "id" },
          async (err, file) => {
            if (err) {
              console.error(err);
            } else {
              let newFolder = await new Folder({
                folderId: file.data.id,
                folderName: folderName,
                folderParentDriveId: driveId,
              });

              await User.updateOne(
                { email: email, "drives.id": driveId },
                { $push: { "drives.$.folders": newFolder } }
              );
            }
          }
        );
      } else {
        let newFolder = await new Folder({
          folderId: files[0].id,
          folderName: files[0].name,
          folderParentDriveId: driveId,
        });
        await User.updateOne(
          {
            email: email,
            "drives.id": driveId,
            "drives.folders.folderId": { $ne: files[0].id },
          },
          { $push: { "drives.$.folders": newFolder } }
        );
      }
    });
  });
};

const listFiles = (auth, driveId, email, query, wholeRefresh, socketId) => {
  return new Promise((resolve, reject) => {
    const drive = google.drive({ version: "v3", auth });
    getList(drive, "", [], query).then((files) => {
      files.map(async (file) => {
        if (file.mimeType !== "application/vnd.google-apps.folder") {
          let folderType = await common.folderTypeAssign(file);
          let newFile;
          if (typeof file.parents !== "undefined") {
            newFile = await new File({
              fileId: file.id,
              fileParentId: file.parents[0],
              fileFolderType: folderType,
              fileName: file.name,
              iconLink: file.iconLink,
              webContentLink: file.webContentLink,
              webViewLink: file.webViewLink,
              mimeType: file.mimeType,
              fullFileExtension: file.fullFileExtension,
              size: file.size,
              createdAt: new Date(),
            });
          } else {
            newFile = await new File({
              fileId: file.id,
              fileName: file.name,
              fileFolderType: folderType,
              iconLink: file.iconLink,
              webContentLink: file.webContentLink,
              webViewLink: file.webViewLink,
              mimeType: file.mimeType,
              fullFileExtension: file.fullFileExtension,
              size: file.size,
              createdAt: new Date(),
            });
          }
          if (!wholeRefresh) {
            await User.updateOne(
              {
                email: email,
                "drives.id": driveId,
                "drives.files.fileId": { $ne: file.id },
              },
              { $push: { "drives.$.files": newFile } }
            );
          } else {
            await User.updateOne(
              { email: email, "drives.id": driveId },
              { $push: { "drives.$.files": newFile } }
            );
            User.findOne(
              { email: email, "drives.id": driveId },
              { "drives.$": 1 }
            )
              .then((driveItems) => {
                io.sockets.connected[socketId].emit("googleFiles", {
                  driveId: driveItems.drives[0].id,
                  storageEmail: driveItems.drives[0].email,
                  storageLimit: driveItems.drives[0].storageLimit,
                  storageUsage: driveItems.drives[0].storageUsage,
                  storageUsagePct: driveItems.drives[0].storageUsagePct,
                  files: driveItems.drives[0].files,
                });
              })
              .catch((err) =>
                console.log("google list file error in emitting data :", err)
              );
          }
        }
      });
      if (files.length > 0) {
        resolve("yes");
      } else {
        resolve("no");
      }
    });
  });
};

const getList = (drive, pageToken, fileList, query) => {
  return new Promise((resolve) => {
    try {
      console.log("실행 getlist!!");
      drive.files.list(
        {
          auth: oauth2Client,
          corpora: "user",
          pageSize: 10,
          // q: queryString,
          q: query,
          pageToken: pageToken ? pageToken : "",
          fields: "nextPageToken, files(*)",
          // files(name,webViewLink)
        },
        (err, res) => {
          if (err)
            return console.log(
              "google get list: The API returned an error: " + err
            );

          if (res.data.files.length) {
            fileList = fileList.concat(res.data.files);
            if (res.data.nextPageToken) {
              resolve(getList(drive, res.data.nextPageToken, fileList, query));
            } else {
              resolve(fileList);
            }
          } else {
            // console.log("No files found.");
            resolve([]);
          }
        }
      );
    } catch (err) {
      console.log("google get list of files error in pulling files:", err);
    }
  });
};

const uploadFile = async (driveIdtoWrite, file) => {
  try {
    console.log("google drive upload");
    // console.log("refresh token to use : "+driveIdtoWrite.refreshToken);
    let auth = await getOAuthClient();
    auth.setCredentials({ refresh_token: driveIdtoWrite.refreshToken });
    console.log("creating file");
    let folderId = await driveIdtoWrite.folders.find(
      (o) => o.folderName === file.folderType
    ).folderId;
    // console.log("folder id :",folderId);
    const drive = google.drive({ version: "v3", auth });
    var requestBody = {
      name: file.name,
      mimeType: file.mimeType,
      parents: [folderId],
    };

    var fileMetadata = {
      name: file.name,
      parents: [folderId],
    };
    var media = {
      mimeType: file.mimeType,
      body: fs.createReadStream("./tmp/" + file.name),
    };

    let uploadStatus = await drive.files.create(
      {
        resource: fileMetadata,
        requestBody: requestBody,
        media: media,
        fields: "id",
      },
      {
        onUploadProgress: (evt) => {
          const progress = (evt.bytesRead / file.size) * 100;
          readline.clearLine();
          readline.cursorTo(0);
          process.stdout.write(`${Math.round(progress)}% complete`);
        },
      }
    );

    if (typeof uploadStatus.data.id !== "undefined") {
      console.log("Successfully uploaded!");
      return "success";
    } else {
      console.log("Failed");
      return "failed";
    }
  } catch (error) {
    console.log("google upload file", error.message);
    return error.message;
  }
};

const deleteFile = async (email, drive, fileId) => {
  try {
    let oAuth2Client = await getOAuthClient();
    oAuth2Client.setCredentials({ refresh_token: drive.refreshToken });
    var client = google.drive({
      version: "v3",
      auth: oAuth2Client,
    });

    let resp = await client.files.delete({ fileId: fileId });
    console.log(resp);
    console.log("files deleted");

    User.updateOne(
      { email: email, "drives.id": drive.id },
      { $pull: { "drives.$[].files": { fileId: fileId } } }
    )
      .then((resp) => {
        console.log("google: response from db file del: ", resp);
        return "deleted file";
      })
      .catch((err) => {
        console.log("google delete file from db error: ", err);
      });
  } catch (err) {
    console.log("google delete file", err.msg);
    return err.msg;
  }
};

module.exports = {
  getProfile,
  getMeta,
  fetchFilesGoogle,
  listFiles,
  createDefaultFolders,
  uploadFile,
  deleteFile,
};
