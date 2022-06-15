const mongoose = require("mongoose");
const driveSchema =require("./Drives");  
const userSchema = new mongoose.Schema({
username: {type:String,
    required:true,
    max:255
},
email:{
    type:String,
    required:true,
    min:6,
    max:255
},
password:{
    type:String,
    required:true,
    min:6,
    max:1024
},
date:{
    type:Date,
    default:Date.now
},
lastDriveWriteIndx:{type:Number,default: -1},
drives:[driveSchema]
});

module.exports =mongoose.model("User",userSchema);
