// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

var graph = require('@microsoft/microsoft-graph-client');
var tokens = require('./tokens');
let moment = require('moment'); 
const driveSchema = require("./models/Drives");
const folderSchema = require("./models/Folder");
const fileSchema = require("./models/Files");
const User = require("./models/User");
const Drive = new mongoose.model("Drive", driveSchema);
const Folder = new mongoose.model("Folder", folderSchema);
const File = new mongoose.model("File", fileSchema);
common = require('./common');
var async = require('async');



require('isomorphic-fetch');
let FolderQueue=[];
let FolderQueueReturn=[];
let FileQueue=[];

const FolderNames=[{name:'PDF'},{name:'WordDocument'},{name:'Spreadsheet'},{name:'PowerPoint'},{name:'OneNote'},{name:'Application'},{name:'Compressed'},{name:'Audio'},{name:'Image'},{name:'Video'},{name:'Plain'},{name:'Others'}];


const getAuthenticatedClient= async (accessToken) => {
  const client = graph.Client.init({
    authProvider: (done) => {
      done(null, accessToken);
    }
  });

  return client;
}

  const getUserDetails=async (accessToken)=> {
    const client = await getAuthenticatedClient(accessToken);
    // console.log(client);
    const user = await client.api('/me').get();
    return user;
  }
  
  const getDriveMetaInit =async (accessToken)=> {
    const client = await getAuthenticatedClient(accessToken);
    const meta = await client.api('/me/drive').get();
    return meta;
  }
  const getDriveMeta =async (email,drive)=> {
    const accessToken=await tokens.getAccessToken(email,drive);
    const client = await getAuthenticatedClient(accessToken);
    const meta = await client.api('/me/drive').get();
    return meta;
  }
         // Generic helper function that can be used for the three operations:        
const operation = (list1, list2, isUnion = false) =>
list1.filter( a => isUnion === list2.some( b => a.name === b.name ) );

// Following functions are to be used:
const inBoth = (list1, list2) => operation(list1, list2, true),
  inFirstOnly = operation,
  inSecondOnly = (list1, list2) => inFirstOnly(list2, list1);


  const createFolder = async(accessToken,email,driveId,providedFolders)=>{
    console.log("Creating folder");
    const client =await getAuthenticatedClient(accessToken);
    if(typeof providedFolders !=="undefined")
    { 
  let present=inBoth(providedFolders, FolderNames); 
  await present.forEach(async (folder)=>{
  let newFolder = await new Folder({folderId:folder.id,folderName:folder.name,folderParentDriveId:driveId});
  await User.updateOne({"email":email,"drives.id":driveId,"drives.folders.folderId": {$ne: folder.id}},  {"$push":{"drives.$.folders": newFolder}});
  });
  let absent=inSecondOnly(providedFolders, FolderNames);
  absent.forEach(async (folder)=>{
let driveItem = {
      name: folder.name,
      folder: { },
      '@microsoft.graph.conflictBehavior': "fail"
    };
 try{
      await client.api('/me/drive/root/children')
      .post(driveItem)
      .then(async folder=>{
        // console.log(folder);
        let newFolder = await new Folder({folderId:folder.id,folderName:folder.name,folderParentDriveId:driveId});
        await User.updateOne({"email":email,"drives.id":driveId,"drives.folders.folderId": {$ne: folder.id}},  {"$push":{"drives.$.folders": newFolder}});

      });
    }
    catch(error)
    {
      console.log("ms create folder: ",error);
    }    
  })

  }   
console.log("returning from creation of folders");
  }

  const fetchFilesMS= async (email,drive,socketId)=> {
    // console.log("Drive:",drive.id)
    const accessToken=await tokens.getAccessToken(email,drive);
    const client =await getAuthenticatedClient(accessToken);
  
    let {drives} =await User.findOne({"email":email,"drives.id":drive.id},{"drives.$":1});
    let deltaLink=drives[0].deltaLink;
   

    if(typeof deltaLink === "undefined" || deltaLink === "")
    {
    // console.log("delta link absent:",deltaLink);
    let Query=`/me/drive/root/delta`;
    let {items,nextDeltaLink}=await getItems(client,Query);
    let allItems=JSON.parse(items[0]);
    
    try{
    await User.updateOne({"email":email,"drives.id":drive.id}, {"$set":{"drives.$.deltaLink": nextDeltaLink}});  
    }
    catch(err)
    {
    console.log("ms fetch files , error in saving delta link: ",err);
    }
    let folders =allItems.filter(a=>a.folder !== undefined && a.deleted=== undefined).map(a=> { return {id:a.id,name:a.name}});
    let files =allItems.filter(a=>a.folder === undefined && a.deleted=== undefined);
    await createFolder(accessToken,email,drive.id,folders);
    
    files.forEach(async (source)=>{
    let folderType= await common.folderTypeAssign({mimeType:source.file.mimeType,fullFileExtension:(source.name).split(".")[1]});
    let newFile = await new File({
      fileId:source.id,
      fileParentId:source.parentReference.id,
      fileFolderType:folderType,
      fileName:source.name,
      iconLink:folderType,
      webContentLink:source["@microsoft.graph.downloadUrl"],
      webViewLink:source.webUrl,
      mimeType:source.file.mimeType,
      fullFileExtension:(source.name).split(".")[1],
      size:source.size,
      createdAt:new Date()
    });
    try{
    await User.updateOne({"email":email,"drives.id":drive.id,"drives.files.fileId": {$ne: source.id}}, {"$push":{"drives.$.files":newFile}});
    }catch(error)
    {
      console.log("ms upload file,error in uploading file details to server");
    }
    });

    if(files.length>0){
      const userDriveQuota = await getDriveMetaInit(accessToken);
      let driveUsgPct=(userDriveQuota.quota.used/userDriveQuota.quota.total)*100;
      driveUsgPct=Math.round((driveUsgPct + Number.EPSILON) * 100) / 100;
      await User.updateOne({"email":email,"drives.id":drive.id}, {"$set":{"drives.$.storageUsage": userDriveQuota.quota.used,"drives.$.storageUsageInDrive": userDriveQuota.quota.used,"drives.$.storageUsageInDriveTrash": userDriveQuota.quota.deleted,"drives.$.storageUsagePct":driveUsgPct}});
  
      User.findOne({"email":email,"drives.id":drive.id},{"drives.$":1})
      .then((driveItems)=>{
        console.log("oneDrive : , obtained driveitems: ",driveItems);
        if(typeof socketId !==undefined){
       io.sockets.connected[socketId].emit('oneDriveFiles', {driveId:driveItems.drives[0].id,
        storageEmail:driveItems.drives[0].email,
        storageLimit:driveItems.drives[0].storageLimit,
        storageUsage:driveItems.drives[0].storageUsage,
        storageUsagePct:driveItems.drives[0].storageUsagePct,
        files:driveItems.drives[0].files});
       }
       })
      .catch((err)=>console.log("ms fetch file,error in emitting data :",err));
    }


    
    }
    else
    {
      // console.log("delta link present:",deltaLink);
      let Query=deltaLink;
      let {items,nextDeltaLink}=await getItems(client,Query);
      // console.log("items: ",items);
      let allItems=JSON.parse(items[0]);
      // console.log("All items:",allItems);
      console.log("new delta link received:");
      // console.log(nextDeltaLink);
      try{
      await User.updateOne({"email":email,"drives.id":drive.id}, {"$set":{"drives.$.deltaLink": nextDeltaLink}});  
      }
      catch(err)
      {
      console.log("ms fetch file, error in saving delta link: ",err);
      }

      let folders =allItems.filter(a=>a.folder !== undefined && a.deleted=== undefined).map(a=> { return {id:a.id,name:a.name}});
      let files =allItems.filter(a=>a.folder === undefined && a.deleted=== undefined);
      // console.log("folders: ",folders);
      // console.log("files: ",files);
      files.forEach(async (source)=>{
      console.log("updating file details to db");
      let folderType= await common.folderTypeAssign({mimeType:source.file.mimeType,fullFileExtension:(source.name).split(".")[(source.name).split(".").length-1]});
      let newFile = await new File({
        fileId:source.id,
        fileParentId:source.parentReference.id,
        fileFolderType:folderType,
        fileName:source.name,
        iconLink:folderType,
        webContentLink:source["@microsoft.graph.downloadUrl"],
        webViewLink:source.webUrl,
        mimeType:source.file.mimeType,
        fullFileExtension:(source.name).split(".")[1],
        size:source.size,
        createdAt:new Date()
      });
      try{
      await User.updateOne({"email":email,"drives.id":drive.id,"drives.files.fileId": {$ne: source.id}}, {"$push":{"drives.$.files":newFile}});
      }catch(error)
      {
        console.log("ms upload file,error in uploading file details to db");
      }
      });
    
    if(files.length>0){
      const userDriveQuota = await getDriveMetaInit(accessToken);
      let driveUsgPct=(userDriveQuota.quota.used/userDriveQuota.quota.total)*100;
      driveUsgPct=Math.round((driveUsgPct + Number.EPSILON) * 100) / 100;
      await User.updateOne({"email":email,"drives.id":drive.id}, {"$set":{"drives.$.storageUsage": userDriveQuota.quota.used,"drives.$.storageUsageInDrive": userDriveQuota.quota.used,"drives.$.storageUsageInDriveTrash": userDriveQuota.quota.deleted,"drives.$.storageUsagePct":driveUsgPct}});
  
      User.findOne({"email":email,"drives.id":drive.id},{"drives.$":1})
      .then((driveItems)=>{
        console.log("oneDrive : , obtained driveitems: ",driveItems);
       io.sockets.connected[socketId].emit('oneDriveFiles', {driveId:driveItems.drives[0].id,
        storageEmail:driveItems.drives[0].email,
        storageLimit:driveItems.drives[0].storageLimit,
        storageUsage:driveItems.drives[0].storageUsage,
        storageUsagePct:driveItems.drives[0].storageUsagePct,
        files:driveItems.drives[0].files});
       })
      .catch((err)=>console.log("ms fetch file, error in emitting data :",err));

    }
    }

   
    

  }


const getItems= async (client,query)=> {
  let stop=false;
  let buffer=[];
  while(!stop)
  {
    let result= await client.api(query).get();
    // console.log(util.inspect(result.value, {showHidden: false, depth: null}));
    buffer=buffer.concat(JSON.stringify(result.value));
  if(result["@odata.nextLink"] !== undefined)
  {
    query=result["@odata.nextLink"];
  }
  else{
    stop=true;
  }
  }

query ='/me/drive/root/delta?token=latest';
let value= await client.api(query).get();
return {items:buffer,nextDeltaLink:value["@odata.deltaLink"]};
};

const uploadFile= async (email,drive,file)=>{
  // console.log("graph items: ",graph);
  // console.log("onedrive upload");
  // console.log("Drive:",drive.id);
  // console.log("email:",email);
  const accessToken=await tokens.getAccessToken(email,drive);
  let folderName = await drive.folders.find(o => o.folderName === file.folderType).folderName;
  const client =await getAuthenticatedClient(accessToken);

  let fileStream=await fs.readFileSync("./tmp/"+file.name);
  if (fileStream !== undefined){
		let response = await largeFileUpload(client, fileStream,folderName,file.name,file.size);
    console.log("return from large upload function \n");
    // console.log(response);				
    if(response.id !==undefined){
        return file.name +"is uploaded successfully."  ;
      }
        else
        {
          return file.name +"could not be uploaded."  ;
        }      
    }
    else
    {
      return file.name +"could not be uploaded." ;
    }
  }

const largeFileUpload= async (client, file,folderName,fileName,fileSize)=> {
	try {
		const requestUrl = `/me/drive/root:/${folderName}/${fileName}:/createUploadSession`;
		const payload = {
			item: {
				"@microsoft.graph.conflictBehavior": "rename",
				name: fileName,
			},
		};
		const fileObject = {
			size: fileSize,
			content: file,
			name: fileName,
		};
		const uploadSession = await graph.LargeFileUploadTask.createUploadSession(client, requestUrl, payload);
    // console.log("upload session is :",uploadSession);
    const uploadTask = await new graph.LargeFileUploadTask(client, fileObject, uploadSession);
    // console.log("upload task is :",uploadTask);
    const response = await uploadTask.upload();
    // console.log("over here");
    // console.log("response is :",response);
		return response;

	} catch (err) {

    console.log("ms large file upload error: ",err);
    return err.message;
	}
}

const deleteFile = async (email,drive,fileId) =>
{
  try{
    console.log("oneDrive delete");
    // console.log("drive : ",drive);  
    console.log("email : ",email);
    console.log("fileId : ",fileId);  
  const accessToken=await tokens.getAccessToken(email,drive);
  const client =await getAuthenticatedClient(accessToken);
  let res = await client.api(`/me/drive/items/${fileId}`).delete();
  console.log("response of deletion from graph: ",res);
  await User.updateOne({"email":email,"drives.id":drive.id},{$pull : {"drives.$[].files" : {"fileId":fileId}}})

  return "deleted file";
}
catch(err){
  console.log("ms delete file error: ",err.message);
  return err.message;
}
  

}




module.exports ={getUserDetails,getDriveMetaInit,getDriveMeta,fetchFilesMS,uploadFile,deleteFile};
