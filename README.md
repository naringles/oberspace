# OneStorage

## Website : https://desolate-bastion-47247.herokuapp.com/

## Video Demo: https://youtu.be/bnYu1dyTB5s

## Inspiration

With ever increasing dependency on cloud storage to storage and share data across devices, handling multiple cloud drives can get tedious. Also, managing files across drives and remembering which file is stored where is a painful task. A single interface to manage all cloud storage drives at one place shall be easier to handle!

## What it does

This Single Page Application allows users to link their drives (Google Drive, Microsoft OneDrive, Dropbox) and manage, i.e. upload, search, read, delete their files across drives all at one place. The use gets a cumulative view of all drives together - **A single large scaled up drive!**

1. **Drive Addition** 
    - User allows a read/write access to their drive in offline mode ( application tracks changes to the drive even when the user is not logged in to store the latest changes in metadata) to provide most accurate and latest collection of files to user
    
2. **File Read**:
    - The application only stores the metadata of the files, hence ,no user data is getting stored, only file , metdata is stored with application database.
    - Also, it tracks any changes made to the drive in offline, update the stored metadata and send update to client via websockets in real time
    - User can choose to filter out the files by their media types , e.g. PDF, SpreadSheet, Audio, Video , etc. In total files are classified in 12 categories 
    - User can also search for a particular file by name using the auto-complete search option provided
    - Files are opened through the linked drive only, assures secure access of the files!

3. **File Upload**:
    - User uploads a file and the application uses a round robin approach to choose which of the linked drives the file will be uploaded to - maintains a equitable usage of all drives 
    - Files are uploaded to specific folders (12 folders are created in the drive at the time of linking) depending on the media type and/or extension of the file 
    - As soon as the file is uploaded, the delta changes are tracked from the drive and changes are emitted as event to client via web sockets - user gets to view their uploaded file immediately on the application

4. **File Delete**:
    - File to be deleted is removed from the drive where it was uploaded and upon successful deletion , the metadata of the file is also removed from the application database
    - Simultaneously user interface is refreshed with the changes ( by removing the deleting file from listing)

5. **Drive delete**:
    - User can choose to remove a linked drive any time as he/she wishes- The drive metadata and access token is removed from the application database
    - The user can also remove the application access from their drive settings (e.g. [Google drive third party access removal](https://myaccount.google.com/permissions) )  to reset application permissions


## How I built it

This application is built using :
- Node.js to build the backend server environment, along with ExpressJS framework to design the backend   application layer 
- MongoDB as database to store drive and file metadata for users
- React (to check the client side code check `frontend` directory) library to design the client end interface which is the served as static build
- [Socket.IO](https://www.npmjs.com/package/socket.io) library is used to send real time updates file metadata changes to client
- [googleapis](https://www.npmjs.com/package/googleapis) library is used to access google drive javascript api to retrieve and manage user drives & files stored in google drives
- [dropbox](https://www.npmjs.com/package/dropbox) library is used to access dropbox javascript api to retrieve and managa user drives and files
- [Microsoft Graph JavaScript](https://www.npmjs.com/package/@microsoft/microsoft-graph-client) library is used to access and manage drives and files stored on OneDrive
- Separate routes and component functions are maintained for cleaner and efficient implementation of application logic
- [bcryptjs](https://www.npmjs.com/package/bcrypt) library is used to salt hash the user passwords and authenticate the user upon login securely
- React hooks useState, useEffect and useContext are used to effectively create a single page application through maintaining (useState) , refreshing (useEffect) and sharing data (useContext) amongst component states

## Challenges I ran into
- The initial challenge was to create the schema of user, drive ,and file metadata to be stored
    - Since files metadata from different drives can have different fields available, a noSQL database, i.e. MongoDB is used
    - For each user multiple drives are to be registered in **offline** mode, i.e. access and refresh tokens are saved which are periodically checked for expiry and refreshed
    - Four types of schema is designed
        - File Schema - Maintains file metadata information like name, size, creation date, web view link, parent folder, file mime type, etc.
        - Folder Schema- Stores the folder and folder name info, which is used to be used to classify the files in client side and organize the file uploads by file types in the drives        
        - Drive schema - which stores drive info (drive id, capacity, usage) , and also embeds the Files and Folder schema as nested document array
        - User schema - this is top most level schema which stores registered user's name ,email and hashed password info , and embeds and document array of Drive schema 

- Another critical challenge was to set up asynchronous tracking function through each of the three drive APIs and update the backend and client end whenever a new file change is tracked.
    - Here, **sockets were used , wherein each drive refresh component emits event to the specific client with the changes** - bidirectional communication makes real time file metadata update efficient
- Each drive API returns file and drive info in a different format :
    - For example, google drive apis sends a fixed no. of file info at a time with a token for next batch of files to be pulled, whereas microsoft graph client needs parent folder id to return the files present in the specific folder
    - Also, file deletions are handled different by different APIs, google sends deleted file info as well when fetching file info, whereas dropbox and microsoft graph doesn't
    - **Handling these different mode of updates and saving them into a uniform structure was a major challenge**
- **Creating a file upload logic which fairly uses all drives' storage and also avoids going over limit was crucial and challenging**
    - A round robin logic was used
        -A drive is chosen at begin of an user session. Upon receiving a file, storage availability on the drive is checked, and file is uploaded if space is available to hold the entire file size
        - If space is not available, all drives are checked in a cyclic iterative manner to find the next drive wherein space is available
        - Upon termination of a session, the last drive used for upload is marked
        - In next session the drive registered after the last session marked drive is used as a starting point
- Designing the file upload logic was crucial so as to not overrun the memory
    - Used [express-fileupload](https://www.npmjs.com/package/express-fileupload) to handle multiple files form data
    - **Used a temporary directory in secondary disk drive to store the uploaded file as buffer before uploading to cloud drive - to avoid overrunning the memory** 
    - For each drive , **creating a resumable file upload session and providing option of large file upload** was a challenging task as well

- In client side development:
    - **Multiple asynchronous events were to be handled**, and each update needs to be shared across components ( A drive added to the drive list component effectively should add all the files of the drive to files list component) - useState and useContext hooks were crucial to solve this issue

## What I learned

Besides getting more coding proficiency in javascript programming , this project helped me learn the following techniques / skills
- Designing effective data schema for noSQL databases
- Using web sockets for real time bidirectional communication between server and client
- Learning multiple APIs and libraries which I can use effectively in future projects
- Designing better client components which maintain and share their state and context information effectively - resulting in an efficient Single Page Application
- A more responsive UI design 

## What's next for OneStorage
- Providing in-application content editor (document editor,spreadsheet editor) to enable user to create and modify files within application and store them seamlessly
- Providing resumable file upload option - Tracking partial upload ( for large files ) by matching byte array content of the file - Efficient and reliable file upload mechanism for the user
- Shifting from storing files in secondary disk storage to a reliable and resumable storage option like AWS S3 

## Built With
- Node.js
- Express.js
- MongoDB
- React






    








