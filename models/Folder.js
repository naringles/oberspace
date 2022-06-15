const mongoose = require('mongoose');

const folderSchema=new mongoose.Schema({
    folderId:{type:String,required:[true,"need index for folder"]},
    folderName:{type:String,required:true},
    folderParentDriveId:{type:String}
  });
  module.exports=folderSchema;

  