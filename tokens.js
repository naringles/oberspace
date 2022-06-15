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
      var storedToken = msClient.createToken(drive.token);
      
      if (storedToken) {
        // console.log("stored token:");
        // console.log(storedToken);

        if (storedToken.expired()) {
          console.log("microsoft access token expired, refreshing the token and saving in db");
          // refresh token
          try {
            const refreshParams = {
              scope: process.env.OAUTH_SCOPES,
            };
      
            var newToken = await storedToken.refresh(refreshParams);
       
          } catch (error) {
            console.log('Error refreshing access token: ', error.message);
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
