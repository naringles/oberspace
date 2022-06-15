const mongoose = require('mongoose');
require('mongoose-long')(mongoose);
var SchemaTypes = mongoose.Schema.Types;

const fileSchema=new mongoose.Schema({
    fileId:{type:String,required:[true,"need index for folder"]},
    fileParentId:{type:String},
    fileFolderType:{type:String},
    fileName:{type:String,required:true},
    iconLink:{type:String},
    webContentLink:{type:String},
    webViewLink:{type:String},
    mimeType:{type:String},
    fullFileExtension:{type:String},
    size:SchemaTypes.Long,
    createdAt:{
      type:Date,
      required:true,
      default: function(){return moment().subtract(1, 'day');}
  }
  });
  module.exports=fileSchema;

  
