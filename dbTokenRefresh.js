// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
require("dotenv").config({ path: "./.env" });

const driveSchema = require("./models/Drives");
const folderSchema = require("./models/Folder");
const fileSchema = require("./models/Files");

const User = require("./models/User");
const Drive = new mongoose.model("Drive", driveSchema);
const Folder = new mongoose.model("Folder", folderSchema);
const File = new mongoose.model("File", fileSchema);

// <TokensSnippet>
module.exports = {
  getAccessToken: async function(email,drive) {
    // console.log("reached refresh token function");
      // Get the stored token
      console.log("entered dropbox access token refresh section");
      console.log("dropbox drive token: ",drive.refreshToken);
      var storedToken = await dbClient.createToken({...drive.token,refresh_token:drive.refreshToken})
      console.log("Stored token is: ",storedToken.token);
      var refresh_token=drive.refreshToken;
      
      if (storedToken) {
        // storedToken.token.refresh_token=drive.refreshToken;     
        // console.log("stored token is -:");        
        // console.log(storedToken.token);

        if (storedToken.expired()) {
          console.log(" dropbox access token expired, refreshing the token and saving in db");
          // refresh token
          try {      
          var newToken = await storedToken.refresh();
          if (!newToken.token.hasOwnProperty('refresh_token')){
            newToken.token['refresh_token']=refresh_token;
          }

          console.log("new token: ",newToken);

          } catch (error) {
            console.log('Error refreshing dropbox access token: ', error.message);
          }   
          console.log("new Token: ",newToken) ;      

          // Update stored token
          await User.updateOne({"email":email,"drives.id":drive.id}, {"$set":{"drives.$.token": newToken.token}}); 

          return newToken.token.access_token;
        }

        // Token still valid, just return it
        console.log("access token did not expire");
        return storedToken.token.access_token;
      }
    
  }
};
// </TokensSnippet>
