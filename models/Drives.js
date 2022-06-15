const mongoose = require('mongoose');
const folderSchema =require("./Folder");
const fileSchema =require("./Files");  
require('mongoose-long')(mongoose);
var SchemaTypes = mongoose.Schema.Types;


const driveSchema=new mongoose.Schema({
    id:{type:String,required:[true,"need an id"]},
    email:{type:String,required:true},
    refreshToken:{type:String},
    token:{
      token_type:{type:String},
      scope:{type:String},
      expires_in:{type:Number},
      ext_expires_in:{type:Number},
      access_token:{type:String},
      refresh_token:{type:String},
      id_token:{type:String},
      expires_at:{type:Date}
    },
    deltaLink:{type:String},
    accountName:{type:String},
    storageType:{type:String},
    storageLimit:SchemaTypes.Long,
    storageUsage:SchemaTypes.Long,
    storageUsagePct:mongoose.Schema.Types.Decimal128,
    storageUsageInDrive:SchemaTypes.Long,
    storageUsageInDriveTrash:SchemaTypes.Long,
    folders:[folderSchema],
    files:[fileSchema]
  });
  module.exports=driveSchema;

  