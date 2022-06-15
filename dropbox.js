// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
const fetch=require('isomorphic-fetch');
var Dropbox = require('dropbox').Dropbox;
var tokens = require('./dbTokenRefresh');
let moment = require('moment'); 
const driveSchema = require("./models/Drives");
const folderSchema = require("./models/Folder");
const fileSchema = require("./models/Files");
const User = require("./models/User");
const Drive = new mongoose.model("Drive", driveSchema);
const Folder = new mongoose.model("Folder", folderSchema);
const File = new mongoose.model("File", fileSchema);
common = require('./common');



const FolderNames=[{name:'PDF'},{name:'WordDocument'},{name:'Spreadsheet'},{name:'PowerPoint'},{name:'OneNote'},{name:'Application'},{name:'Compressed'},{name:'Audio'},{name:'Image'},{name:'Video'},{name:'Plain'},{name:'Others'}];


const getAuthenticatedClient= async (accessToken) => {
  var dbx = new Dropbox({fetch:fetch, accessToken: accessToken });
  return dbx;
}

  const getUserDetails=async (accessToken)=> {
    try{
    const client = await getAuthenticatedClient(accessToken);
    const user = await client.usersGetCurrentAccount();
    return user;
    }
    catch(err)
    {
      console.log("dropbox get user",err.message);
      return err.message;
    }
  }

  
  const getDriveMeta=async (accessToken)=> {
    const client = await getAuthenticatedClient(accessToken);
    const meta = await client.usersGetSpaceUsage();
    return meta;
  }

  
          // Generic helper function that can be used for the three operations:        
  const operation = (list1, list2, isUnion = false) =>
  list1.filter( a => isUnion === list2.some( b => a.name === b.name ) );

  // Following functions are to be used:
  const inBoth = (list1, list2) => operation(list1, list2, true),
  inFirstOnly = operation,
  inSecondOnly = (list1, list2) => inFirstOnly(list2, list1);

  const createFolder = async(accessToken,email,driveId,providedFolders)=>
  {
      try{
      console.log("Creating folder");
      const client =await getAuthenticatedClient(accessToken);
      if(typeof providedFolders !=="undefined")
      { 
     
        let present=inBoth(providedFolders, FolderNames); 
        // console.log("present in both",present);
        await present.forEach(async (folder)=>{
        let newFolder = await new Folder({folderId:folder.id,folderName:folder.name,folderParentDriveId:driveId});
        await User.updateOne({"email":email,"drives.id":driveId,"drives.folders.folderId": {$ne: folder.id}},  {"$push":{"drives.$.folders": newFolder}});
        });
        let absent=await inSecondOnly(providedFolders, FolderNames);
        if (absent.length === 0) {console.log("returning from folder creation");return};
        let paths = absent.map(a=> { return "/"+a.name});
        // console.log("paths",paths);

        console.log("absent folders: ",absent);
        // absent.forEach((folder)=>{
          // filesCreateFolderV2
              client.filesCreateFolderBatch({paths: paths,autorename:false})
              .then((folderCreated)=>{
                // console.log("folder created: ",folderCreated);
              // let newFolder = new Folder({folderId:folderCreated.metadata.id,folderName:folderCreated.metadata.name,folderParentDriveId:driveId});
              // User.updateOne({"email":email,"drives.id":driveId,"drives.folders.folderId": {$ne: folderCreated.metadata.id}},  {"$push":{"drives.$.folders": newFolder}});
              }).          
            catch((err)=>{
              console.log("dropbox create folder:",err);
            });                
        // });
      }
      console.log("returning from folder creation");
     
    }
    catch(error)
    {
      console.log("dropbox create folder:",error);
    } ;
  
  }


const fetchFilesDB= async (email,drive,socketId)=> {
    try{
    console.log("reached dropbox");
    // console.log("Drive:",drive);
    const accessToken=await tokens.getAccessToken(email,drive);
    // console.log("accessToken: ",accessToken);
    const client =await getAuthenticatedClient(accessToken);
    

    let cursorLatest=drive.deltaLink;
    let folders=[];
    let files=[];
    let hasMore=true;

    if(typeof cursorLatest === "undefined" || cursorLatest === "")
    {
    console.log("cursor absent");
    let response =await client.filesListFolder({path: '',recursive:true,limit:10});  
      folders = response.entries.filter(a=>a['.tag'] === 'folder').map(a=> { return {id:a.id,name:a.name}});
      files =response.entries.filter(a=>a['.tag'] === 'file');
      cursorLatest=response.cursor
      hasMore=response.has_more;
    }
     folders=[...folders,...drive.folders.map(a=> { return {id:a.folderId,name:a.folderName}})];
    //  console.log("folders now: ",folders);
     while(hasMore){
       console.log("cursor present");
      let response =await client.filesListFolderContinue({cursor:cursorLatest});
      let filesMore =response.entries.filter(a=>a['.tag'] === 'file');
      let foldersMore = response.entries.filter(a=>a['.tag'] === 'folder').map(a=> { return {id:a.id,name:a.name}});
      files=[...files,...filesMore];
      folders=[...folders,...foldersMore];
      cursorLatest=response.cursor;
      hasMore=response.has_more;
    }
    await User.updateOne({"email":email,"drives.id":drive.id}, {"$set":{"drives.$.deltaLink": cursorLatest}});  
    await createFolder(accessToken,email,drive.id,folders);
    if(files.length>0){
      console.log("saving new files");
     files.forEach(async(file)=>{
      let parentFolders=file.path_display.split("/");
      let immediateParent= parentFolders[parentFolders.length-2];
      let immediateParentID=await folders.filter(a=>a['name'] === immediateParent).map(a=> { return a.id})[0];
      if(immediateParentID === undefined || immediateParentID === "")
      {
        immediateParentID=drive.id;
      }
      
            let folderType= await common.folderTypeAssign({mimeType:"not.available",fullFileExtension:(file.name).split(".")[(file.name).split(".").length-1]});
            // console.log("parent for file :",file.name, " is :", immediateParent," parent id :",immediateParentID ," folder type is: ",folderType);
            let shareUrl="";
            try{
            let linkResponse=await client.sharingCreateSharedLinkWithSettings({path:file.path_display});
            shareUrl=linkResponse.url;
            // console.log("sharinglink for file: ",file.name,"is : ",shareUrl);
            }
            catch(err){
              console.log("dropbox fetch files error: ",err);
              let linkResponse=await client.sharingListSharedLinks({path:file.path_display});
              shareUrl=linkResponse.links[0].url;                            
            }
            // console.log("sharinglink for file: ",file.name,"is : ",shareUrl);


        let newFile = await new File({
        fileId:file.id,
        fileParentId:immediateParentID,
        fileFolderType:folderType,
        fileName:file.name,
        iconLink:folderType,
        webContentLink:shareUrl,
        webViewLink:shareUrl,
        mimeType:"not.available",
        fullFileExtension:(file.name).split(".")[(file.name).split(".").length-1],
        size:file.size,
        createdAt:new Date()
      });
      try{  
      await User.updateOne({"email":email,"drives.id":drive.id,"drives.files.fileId": {$ne: file.id}}, {"$push":{"drives.$.files":newFile}});
      User.findOne({"email":email,"drives.id":drive.id},{"drives.$":1})
      .then((driveItems)=>{
        console.log("dropbox : , obtained driveitems: ",driveItems);
        if(typeof socketId !==undefined){
       io.sockets.connected[socketId].emit('dbxFiles', {driveId:driveItems.drives[0].id,
        storageEmail:driveItems.drives[0].email,
        storageLimit:driveItems.drives[0].storageLimit,
        storageUsage:driveItems.drives[0].storageUsage,
        storageUsagePct:driveItems.drives[0].storageUsagePct,
        files:driveItems.drives[0].files});
       }
       })
      .catch((err)=>console.log("dropbox fetch files,error in emitting data :",err));
  
      }
      catch(err){
        console.log("dropbox fetch files,error in saving file to db: ",err);
      }

    }) 
  }
  

    }

  catch(error)
   {
    console.error(error);
  };
  }

  const uploadFile= async (email,drive,file)=>{
    // console.log("graph items: ",graph);
    console.log("dropbox upload");
    // console.log("Drive:",drive.id);
    // console.log("email:",email);
    // console.log("file details: ",file);

    const accessToken=await tokens.getAccessToken(email,drive);
    // console.log("accessToken: ",accessToken);
    let folderName = await drive.folders.find(o => o.folderName === file.folderType).folderName;
    // console.log("foldername: ",folderName);
    const client =await getAuthenticatedClient(accessToken);
  
    // let fileStream=await fs.readFileSync("./tmp/"+file.name);
    let fileStream=await fs.createReadStream("./tmp/"+file.name)
    if (fileStream !== undefined){
      console.log("trying to upload to client");
      // let response = await largeFileUpload(client, fileStream,folderName,file.name,file.size);
      let response = await client.filesUpload({path: `/${folderName}/${file.name}`, contents: fileStream});
      
      console.log("return from large upload function \n");
       
      console.log("response:",response);
        return file.name +"is uploaded successfully."  ;              
      }
      else
      {
        return file.name +"could not be uploaded." ;
      }
    }
  

    const deleteFile = async (email,drive,fileFolderType,fileName,fileId) =>
    {
      console.log("entered dropbox file delete")
      try{
      
        console.log("drive id: ",drive.id);  
        console.log("email : ",email);  
        console.log("fileFolderType : ",fileFolderType);  
        console.log("fileName : ",fileName);  
        console.log("fileId : ",fileId);  

        const accessToken=await tokens.getAccessToken(email,drive);
        const client =await getAuthenticatedClient(accessToken);
        console.log("accessToken: ",accessToken);
        console.log("client: ",client);
        
        let res = await client.filesDeleteV2({path:`/${fileFolderType}/${fileName}`});
        console.log("response of deletion from dropbox: ",res);
      await User.updateOne({"email":email,"drives.id":drive.id},{$pull : {"drives.$[].files" : {"fileId":fileId}}})
      .then ((response)=>{
        console.log("file delete response: ",response);
        return "deleted file";
      }) 
        
    }
    catch(err){
      console.log("dropbox delete files:",err.message);
      return err.message;
    }
      
    
    }
module.exports ={getUserDetails,getDriveMeta,fetchFilesDB,uploadFile,deleteFile};
