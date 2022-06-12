//jshint esversion:6

path = require("path");
moment = require("moment");
require("dotenv").config({ path: "./.env" });
fs = require("fs");

const { google } = require("googleapis");
const express = require("express");
const fileUpload = require("express-fileupload");

var Session = require("express-session");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const app = express();
const cors = require("cors");

mongoose = require("mongoose");
util = require("util");

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

// const appli = app.listen(port);
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server, {
  allowEIO3: true,
}).listen(server);
// const io = new Server(httpServer);

io.on("connection", (socket) => {
  console.log("a user connected");
});

server.listen(3000, function () {
  console.log("Socket IO server listening on port 3000");
});

const CLIENT_LOGIN_PAGE_URL =
  process.env.NODE_ENV === "production" ? "/" : "http://localhost:3000/";
const CLIENT_LANDING_PAGE_URL =
  process.env.NODE_ENV === "production"
    ? "/user/home/"
    : "http://localhost:3000/user/home/";
common = require("./common");
graph = require("./msGraph");
googleDrive = require("./google");
dbx = require("./dropbox");
const authRoutes = require("./routes/auth_routes");

const { AuthorizationCode } = require("simple-oauth2");

// Configure simple-oauth2
const msConfig = {
  client: {
    id: process.env.OAUTH_APP_ID,
    secret: process.env.OAUTH_APP_PASSWORD,
  },
  auth: {
    tokenHost: process.env.OAUTH_AUTHORITY,
    authorizePath: process.env.OAUTH_AUTHORIZE_ENDPOINT,
    tokenPath: process.env.OAUTH_TOKEN_ENDPOINT,
  },
};

const dbConfig = {
  client: {
    id: process.env.db_client_id,
    secret: process.env.db_secret,
  },
  auth: {
    tokenHost: "https://api.dropbox.com",
    authorizeHost: "https://dropbox.com",
    tokenPath: "/oauth2/token",
    authorizePath: "/oauth2/authorize",
  },
};

msClient = new AuthorizationCode(msConfig);
dbClient = new AuthorizationCode(dbConfig);

let oAuth2Client = new google.auth.OAuth2(
  process.env.client_id,
  process.env.client_secret,
  process.env.redirect_uris
);

const msAuthorizationUri = msClient.authorizeURL({
  redirect_uri: process.env.OAUTH_REDIRECT_URI,
  scope: process.env.OAUTH_SCOPES,
});

const dbAuthorizationUri = dbClient.authorizeURL({
  redirect_uri: process.env.db_redirect_uri,
  token_access_type: "offline",
});

const googelAuthorizationUri = oAuth2Client.generateAuthUrl({
  access_type: "offline",
  scope: process.env.client_scopes.split(" "),
});

// data model- mongoose - start
require("mongoose-long")(mongoose);
const driveSchema = require("./models/Drives");
const folderSchema = require("./models/Folder");
const fileSchema = require("./models/Files");
const User = require("./models/User");
const Drive = new mongoose.model("Drive", driveSchema);

mongoose.connect(
  process.env.DB_URI,
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
  (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("connected to db successfully");
    }
  }
);

mongoose.set("useCreateIndex", true);
mongoose.plugin((schema) => {
  schema.options.usePushEach = true;
});
// data model- mongoose - end

// initial variable and function calls
filesPulled = false;

common.createFolderMapping();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./tmp/",
  })
);

// app.use(cors());
app.use(
  cors({
    origin: "http://localhost:3000/",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

const sessionMiddleWare = Session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
});

app.use(sessionMiddleWare);

// app.set("view engine", "ejs");
// app.use(express.static("public"));

app.use("/user/auth", authRoutes);

// app.use(bodyParser.urlencoded({extended: true}));
// const path = require("path");
app.use(express.static(path.join(__dirname, "./build")));

io.use(function (socket, next) {
  sessionMiddleWare(socket.request, socket.request.res, next);
});

io.on("connection", (socket) => {
  // socket.handshake.headers
  console.log(`socket.io connected: ${socket.id}`);
  // save socket.io socket in the session
  //  console.log("session at socket.io connection:\n", socket.request.session);
  socket.request.session.socketio = socket.id;
  socket.request.session.save();
});

async function getOAuthClient() {
  return new google.auth.OAuth2(
    process.env.client_id,
    process.env.client_secret,
    process.env.redirect_uris
  );
}

const authCheck = (req, res, next) => {
  if (!req.session.user) {
    res.status(401).json({
      authenticated: false,
      message: "user has not been authenticated",
    });
  } else {
    next();
  }
};

refreshInterval = "";
const refreshFiles = async (email, socketID) => {
  console.log("refreshing files");
  let present = moment();
  present.subtract("24", "hours");
  let dateQuery =
    "(modifiedTime > '" +
    present.utc().format() +
    "' or createdTime > '" +
    present.utc().format() +
    "')";
  let query =
    "mimeType != 'application/vnd.google-apps.folder' and trashed = false and " +
    dateQuery;
  fetchFiles(email, query, undefined, socketID);
};

var dir = "./tmp";

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

app.get("/user/data/read", authCheck, async (req, res) => {
  try {
    let session = req.session;
    console.log("called read");
    if (typeof session["lastDriveWriteIndex"] === "undefined") {
      let userDriveInfo = await User.findOne(
        { email: req.session.user.email },
        {
          lastDriveWriteIndx: 1,
          "drives.id": 1,
          "drives.storageType": 1,
          "drives.token": 1,
          "drives.refreshToken": 1,
          "drives.storageLimit": 1,
          "drives.storageUsage": 1,
          "drives.storageUsagePct": 1,
          "drives.folders": 1,
        }
      );
      let nextDriveWriteIndex;
      if (
        userDriveInfo.lastDriveWriteIndx === null ||
        userDriveInfo.lastDriveWriteIndx === "null"
      ) {
        nextDriveWriteIndex = 0;
      }
      nextDriveWriteIndex =
        (userDriveInfo.lastDriveWriteIndx + 1) % userDriveInfo.drives.length;
      session["lastDriveWriteIndex"] = userDriveInfo.lastDriveWriteIndx;
      session["nextDriveWriteIndex"] = nextDriveWriteIndex;
      session["driveIds"] = userDriveInfo.drives;
    }
    User.findOne({ email: req.session.user.email }, "drives").then(
      (driveItems) => {
        if (driveItems.drives.length == 0) {
          res.json({
            success: true,
            message: "user has successfully authenticated",
            user: req.session.user.username,
            drives: [],
          });
        } else {
          res.json({
            success: true,
            message: "user has successfully authenticated",
            user: req.session.user.username,
            drives: driveItems.drives,
          });
        }
      }
    );
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      message: "user authentication failed",
      user: {},
      drives: [],
    });
  }
  let present = moment();
  present.subtract("24", "hours");
  let dateQuery =
    "(modifiedTime > '" +
    present.utc().format() +
    "' or createdTime > '" +
    present.utc().format() +
    "')";
  let query =
    "mimeType != 'application/vnd.google-apps.folder' and trashed = false and " +
    dateQuery;
  fetchFiles(req.session.user.email, query, undefined, req.session.socketio);
  // refreshInterval=setInterval( function() { refreshFiles(req.session.user.email,req.session.socketio); }, (1000*60*300));
});

app.get("/user/add/google", authCheck, async (req, res) => {
  console.log("reached google drive add");
  res.redirect(googelAuthorizationUri);
});
app.get("/user/add/ms", authCheck, async (req, res) => {
  res.redirect(msAuthorizationUri);
});
app.get("/user/add/db", authCheck, async (req, res) => {
  // console.log("dbAuthorizationUri: ",dbAuthorizationUri);
  res.redirect(dbAuthorizationUri);
});

//google callback starts
app.get("/google/callback", authCheck, async (req, res) => {
  try {
    console.log("req is: ", req);
    let oAuth2Client = await getOAuthClient();
    const { tokens } = await oAuth2Client.getToken(req.query.code);
    oAuth2Client.setCredentials({
      acess_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
    });
    let data = await googleDrive.getProfile(oAuth2Client);
    let meta = await googleDrive.getMeta(oAuth2Client);

    let driveUsgPct = (meta.storageQuota.usage / meta.storageQuota.limit) * 100;
    driveUsgPct = Math.round((driveUsgPct + Number.EPSILON) * 100) / 100;
    let newDrive = await new Drive({
      id: data.id,
      email: data.email,
      refreshToken: tokens.refresh_token,
      accountName: data.name,
      storageType: "googleDrive",
      storageLimit: meta.storageQuota.limit,
      storageUsage: meta.storageQuota.usage,
      storageUsagePct: driveUsgPct,
      storageUsageInDrive: meta.storageQuota.usageInDrive,
      storageUsageInDriveTrash: meta.storageQuota.usageInDriveTrash,
    });
    console.log("new Drive:");
    console.log(newDrive);

    const userInfo = await User.findOne({ email: req.session.user.email });

    if (!userInfo) {
      res.redirect(
        `${CLIENT_LANDING_PAGE_URL}${req.session.user.username}/?attempt=add&success=false&message=failed%20to%20save%20token`
      );
    }
    const drivePresent = await User.findOne(
      { email: req.session.user.email, "drives.id": data.id },
      { "drives.id": 1 }
    );
    if (drivePresent !== null) {
      res.redirect(
        `${CLIENT_LANDING_PAGE_URL}${req.session.user.username}/?attempt=add&success=false&message=drive%20already%20added`
      );
    } else {
      res.redirect(
        `${CLIENT_LANDING_PAGE_URL}${req.session.user.username}/?attempt=add&success=true&message=drive%20added&newDriveType=${newDrive.storageType}&newDrive=${newDrive.email}`
      );
      userInfo.drives.push(newDrive);
      userInfo.save(async (err) => {
        if (err) {
          console.log("error in saving data to db");
        } else {
          console.log("successfully saved data to db!");
          let query =
            "mimeType != 'application/vnd.google-apps.folder' and trashed = false ";
          fetchFiles(
            req.session.user.email,
            query,
            data.id,
            req.session.socketio
          );
        }
      });
    }
    // await googleDrive.createDefaultFolders(oAuth2Client,req.session.user.email,data.id);
  } catch (error) {
    console.log("error in getting token :" + error);
    res.redirect(
      `${CLIENT_LANDING_PAGE_URL}${req.session.user.username}/?attempt=add&success=false&message=failed%20to%20save%20token`
    );
  }
});
//google callback ends

//dbx callback starts
app.get("/dropbox/callback", authCheck, async (req, res) => {
  if (typeof req.query.code !== "undefined") {
    const { code } = req.query;
    const tokenParams = {
      code,
      redirect_uri: process.env.db_redirect_uri,
    };
    try {
      const accessToken = await dbClient.getToken(tokenParams);
      // console.log("accessToken dropbox:",accessToken);
      const user = await dbx.getUserDetails(accessToken.token.access_token);
      // console.log("user: ",user);

      const userDriveQuota = await dbx.getDriveMeta(
        accessToken.token.access_token
      );
      // console.log("userDriveQuota: ",userDriveQuota);

      let driveUsgPct =
        (userDriveQuota.used / userDriveQuota.allocation.allocated) * 100;
      driveUsgPct = Math.round((driveUsgPct + Number.EPSILON) * 100) / 100;
      let newDrive = await new Drive({
        id: user.account_id,
        email: user.email,
        refreshToken: accessToken.token.refresh_token,
        token: accessToken.token,
        deltaLink: "",
        accountName: user.name.display_name,
        storageType: "dropbox",
        storageLimit: userDriveQuota.allocation.allocated,
        storageUsage: userDriveQuota.used,
        storageUsagePct: driveUsgPct,
        storageUsageInDrive: userDriveQuota.used,
      });
      // console.log("new Drive:");

      // console.log(newDrive);
      const userInfo = await User.findOne({ email: req.session.user.email });
      if (!userInfo) {
        res.redirect(
          `${CLIENT_LANDING_PAGE_URL}${req.session.user.username}/?attempt=add&success=false&message=failed%20to%20save%20token`
        );
      }

      const drivePresent = await User.findOne(
        { email: req.session.user.email, "drives.id": userDriveQuota.id },
        { "drives.id": 1 }
      );
      if (drivePresent !== null) {
        res.redirect(
          `${CLIENT_LANDING_PAGE_URL}${req.session.user.username}/?attempt=add&success=false&message=drive%20already%20added`
        );
      } else {
        res.redirect(
          `${CLIENT_LANDING_PAGE_URL}${req.session.user.username}/?attempt=add&success=true&message=drive%20added&newDriveType=${newDrive.storageType}&newDrive=${newDrive.email}`
        );
        userInfo.drives.push(newDrive);
        userInfo.save(async (err) => {
          if (err) {
            console.log("error in saving data to db");
          } else {
            console.log("successfully saved data to db!");
            fetchFiles(
              req.session.user.email,
              "",
              userDriveQuota.id,
              req.session.socketio
            );
          }
        });
      }
    } catch (error) {
      console.error("Access Token Error", error.message);
      res.redirect(
        `${CLIENT_LANDING_PAGE_URL}${req.session.user.username}/?attempt=add&success=false&message=failed%20to%20save%20token`
      );
    }
  }
});
//dbx callback ends

//ms callback starts
app.get("/ms/callback", authCheck, async (req, res) => {
  if (typeof req.query.code !== "undefined") {
    const { code } = req.query;
    const tokenParams = {
      code,
      redirect_uri: process.env.OAUTH_REDIRECT_URI,
      scope: process.env.OAUTH_SCOPES,
    };
    try {
      const accessToken = await msClient.getToken(tokenParams);
      const user = await graph.getUserDetails(accessToken.token.access_token);
      const userDriveQuota = await graph.getDriveMetaInit(
        accessToken.token.access_token
      );
      let driveUsgPct =
        (userDriveQuota.quota.used / userDriveQuota.quota.total) * 100;
      driveUsgPct = Math.round((driveUsgPct + Number.EPSILON) * 100) / 100;
      let newDrive = await new Drive({
        id: userDriveQuota.id,
        email: user.userPrincipalName,
        refreshToken: accessToken.token.refresh_token,
        token: accessToken.token,
        deltaLink: "",
        accountName: userDriveQuota.owner.user.displayName,
        storageType: "oneDrive",
        storageLimit: userDriveQuota.quota.total,
        storageUsage: userDriveQuota.quota.used,
        storageUsagePct: driveUsgPct,
        storageUsageInDrive: userDriveQuota.quota.used,
        storageUsageInDriveTrash: userDriveQuota.quota.deleted,
      });
      console.log("new Drive:");
      // console.log(newDrive);
      const userInfo = await User.findOne({ email: req.session.user.email });
      if (!userInfo) {
        res.redirect(
          `${CLIENT_LANDING_PAGE_URL}${req.session.user.username}/?attempt=add&success=false&message=failed%20to%20save%20token`
        );
      }

      const drivePresent = await User.findOne(
        { email: req.session.user.email, "drives.id": userDriveQuota.id },
        { "drives.id": 1 }
      );
      if (drivePresent !== null) {
        res.redirect(
          `${CLIENT_LANDING_PAGE_URL}${req.session.user.username}/?attempt=add&success=false&message=drive%20already%20added`
        );
      } else {
        res.redirect(
          `${CLIENT_LANDING_PAGE_URL}${req.session.user.username}/?attempt=add&success=true&message=drive%20added&newDriveType=${newDrive.storageType}&newDrive=${newDrive.email}`
        );
        userInfo.drives.push(newDrive);
        userInfo.save(async (err) => {
          if (err) {
            console.log("error in saving data to db");
          } else {
            console.log("successfully saved data to db!");
            fetchFiles(
              req.session.user.email,
              "",
              userDriveQuota.id,
              req.session.socketio
            );
          }
        });
      }
    } catch (error) {
      console.error("Access Token Error", error.message);
      res.redirect(
        `${CLIENT_LANDING_PAGE_URL}${req.session.user.username}/?attempt=add&success=false&message=failed%20to%20save%20token`
      );
    }
  }
});
//ms callback ends

if (process.env.NODE_ENV === "production") {
  app.get("/*", authCheck, (req, res) => {
    res.sendFile(path.join(__dirname, "./build", "index.html"));
  });
} else {
  app.get("/", authCheck, (req, res) => {
    res.status(200).json({
      authenticated: true,
      message: "user successfully authenticated",
      user: req.user,
      cookies: req.cookies,
    });
    res.redirect(CLIENT_LOGIN_PAGE_URL);
  });
}

app.post("/action/upload/multiple", authCheck, async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(200).json({
      success: false,
      // message: uploadStatus,
      message: "no files",
    });
  }
  // console.log("received file(s): ",req.files.file.length);
  let uploadStatus = "";

  if (req.files.file.length > 1) {
    console.log("received multiple files: ");
    console.log(req.files.file);

    await req.files.file.forEach(async (upFile, index) => {
      console.log(upFile);
      upFile.mv("./tmp/" + upFile.name);

      let fileParts = upFile.name.split(".");
      let fileext = fileParts[fileParts.length - 1];

      let file = new Object({
        name: upFile.name,
        mimeType: upFile.mimetype,
        fullFileExtension: fileext,
        size: upFile.size,
      });
      let folderType = await common.folderTypeAssign(file);
      console.log("folder Type:", folderType);
      file["folderType"] = folderType;
      let status = await uploadFile(req, res, file);
      uploadStatus = uploadStatus.concat(status);
      console.log("status is :" + uploadStatus);
      if (index === req.files.file.length - 1) {
        res.status(200).json({
          success: true,
          message: uploadStatus,
        });
        console.log("refetching files");
        let present = moment();
        present.subtract("1", "hour");
        let dateQuery =
          "(modifiedTime > '" +
          present.utc().format() +
          "' or createdTime > '" +
          present.utc().format() +
          "')";
        let query =
          "mimeType != 'application/vnd.google-apps.folder' and trashed = false and " +
          dateQuery;
        fetchFiles(
          req.session.user.email,
          query,
          undefined,
          req.session.socketio
        );
      }
    });
  } else {
    console.log("received single file");
    console.log(req.files.file);
    let upFile = req.files.file;
    upFile.mv("./tmp/" + upFile.name);

    let fileParts = upFile.name.split(".");
    let fileext = fileParts[fileParts.length - 1];

    let file = new Object({
      name: upFile.name,
      mimeType: upFile.mimetype,
      fullFileExtension: fileext,
      size: upFile.size,
    });
    let folderType = await common.folderTypeAssign(file);
    // console.log("folder Type:",folderType);
    file["folderType"] = folderType;
    let status = await uploadFile(req, res, file);
    uploadStatus = uploadStatus.concat(status);
    console.log("status is :" + uploadStatus);

    res.status(200).json({
      success: true,
      message: uploadStatus,
    });
    console.log("refetching files");
    let present = moment();
    present.subtract("1", "hour");
    let dateQuery =
      "(modifiedTime > '" +
      present.utc().format() +
      "' or createdTime > '" +
      present.utc().format() +
      "')";
    let query =
      "mimeType != 'application/vnd.google-apps.folder' and trashed = false and " +
      dateQuery;
    fetchFiles(req.session.user.email, query, undefined, req.session.socketio);
  }
});

app.post("/action/drive/delete", authCheck, async (req, res) => {
  console.log("drive id to delete: ", req.body.driveIdDelete);
  User.updateOne(
    { email: req.session.user.email },
    { $pull: { drives: { id: req.body.driveIdDelete } } }
  )
    .then((response) => {
      res.status(200).json({
        success: true,
        message: "removed drive",
      });
    })
    .catch((err) => {
      console.log("error in removing drive: ", err);
      res.status(200).json({
        success: false,
        message: "failed to remove drive",
      });
    });
});

app.post("/action/file/delete", authCheck, async (req, res) => {
  try {
    console.log("req body is:");
    console.log(req.body);
    console.log("req session email is:");
    console.log(req.session.user.email);

    let resp = await User.findOne(
      {
        email: req.session.user.email,
        "drives.files.fileId": { $eq: req.body.id },
      },
      { "drives.files.$": 1 }
    );
    console.log("response of find: ", resp);

    // let details=req.body.delete.split("|");
    let driveId = resp.drives[0].id;
    let fileId = req.body.id;
    let driveStorageType = resp.drives[0].storageType;
    let fileFolderType = req.body.folderType;
    let fileName = req.body.name;
    let driveToDeleteFrom = resp.drives[0];
    console.log("drive id :", driveId);
    console.log("fileId:", fileId);
    console.log("driveStorageType:", driveStorageType);
    console.log("fileFolderType:", fileFolderType);
    console.log("fileName:", fileName);
    // console.log("drive to del from :" ,driveToDeleteFrom);

    if (driveStorageType === "googleDrive") {
      let status = await googleDrive.deleteFile(
        req.session.user.email,
        driveToDeleteFrom,
        fileId
      );
      console.log("status: ", status);
      filesPulled = true;
      res.status(200).json({
        success: true,
        message: status,
      });
    } else if (driveStorageType === "oneDrive") {
      let status = await graph.deleteFile(
        req.session.user.email,
        driveToDeleteFrom,
        fileId
      );
      console.log("status: ", status);
      filesPulled = true;
      res.status(200).json({
        success: true,
        message: status,
      });
    } else {
      let status = await dbx.deleteFile(
        req.session.user.email,
        driveToDeleteFrom,
        fileFolderType,
        fileName,
        fileId
      );
      console.log("status: ", status);
      filesPulled = true;
      res.status(200).json({
        success: true,
        message: status,
      });
    }
  } catch (error) {
    res.status(400).json({ status: false, message: error.message });
  }
});

const fetchFiles = async (email, query, newDriveId, socketId) => {
  try {
    filesPulled = false;
    console.log("files pulled status before: " + filesPulled);
    let driveItems;
    if (typeof newDriveId !== "undefined") {
      console.log("new drive is added");
      driveItems = await User.findOne(
        { email: email, "drives.id": newDriveId },
        "drives"
      );
    } else {
      driveItems = await User.findOne({ email: email }, "drives");
    }
    // console.log("drive items:");
    // console.log(driveItems);
    console.log("Socket ID: ", socketId);
    // let googleFetch=false,msFetch=false,dbxFetch=false;

    driveItems.drives.forEach(async (drive) => {
      if (drive.storageType === "googleDrive") {
        googleDrive.fetchFilesGoogle(email, query, drive, socketId);
        // console.log("google fetch flag",googleFetch);
      } else if (drive.storageType === "oneDrive") {
        graph.fetchFilesMS(email, drive, socketId);
        // console.log("ms fetch flag",msFetch);
      } else if (drive.storageType === "dropbox") {
        dbx.fetchFilesDB(email, drive, socketId);
        // console.log("dbx fetch flag",dbxFetch);
      }
    });

    filesPulled = true;

    console.log("files pulled status after: " + filesPulled);

    // User.findOne({email:email},'drives')
    // .then((driveItems)=>{
    //   io.sockets.connected[socketId].emit('drives', driveItems.drives);
    // })
    // .catch((err)=>console.log("error in emitting data :",err));
  } catch (error) {
    console.log("error in fetching files: " + error);
  }
};

const uploadFile = async (req, res, file) => {
  try {
    // console.log("Sesssion info: ");
    // console.log(req.session);
    let session = req.session;
    console.log("file info: ");
    console.log(file);
    let driveIndextoWrite = req.session.nextDriveWriteIndex;
    let driveIdtoWrite = req.session.driveIds[driveIndextoWrite];
    let storageLeft =
      parseInt(driveIdtoWrite.storageLimit) -
      parseInt(driveIdtoWrite.storageUsage);

    if (file.size > storageLeft) {
      let startIndex = driveIndextoWrite;

      while (file.size > storageLeft) {
        driveIndextoWrite = (startIndex + 1) % req.session.driveIds.length;
        driveIdtoWrite = req.session.driveIds[driveIndextoWrite];
        storageLeft =
          parseInt(driveIdtoWrite.storageLimit) -
          parseInt(driveIdtoWrite.storageUsage);
        if (driveIndextoWrite === startIndex) return "driveFull";
      }
      session["nextDriveWriteIndex"] = driveIndextoWrite;
    }
    console.log("drive to write: ");
    console.log(driveIdtoWrite);
    console.log("storageLeft" + storageLeft);
    console.log("upload file size: " + file.size);
    if (driveIdtoWrite.storageType === "googleDrive") {
      try {
        let status =
          (await googleDrive.uploadFile(driveIdtoWrite, file)) +
          "for: " +
          file.name +
          ", ";
        return status;
      } catch (error) {
        return error.message;
      }
    } else if (driveIdtoWrite.storageType === "oneDrive") {
      try {
        let status = await graph.uploadFile(
          req.session.user.email,
          driveIdtoWrite,
          file
        );
        console.log("status received is : ", status);
        return status;
      } catch (error) {
        return error.message;
      }
    } else {
      try {
        let status = await dbx.uploadFile(
          req.session.user.email,
          driveIdtoWrite,
          file
        );
        console.log("status received is : ", status);
        return status;
      } catch (error) {
        return error.message;
      }
    }
  } catch (error) {
    console.log(error.message);
    return error.message;
  }
};
