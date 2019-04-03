//---------------------------------------------------------------------------------
// Drive interface using GAPI 
//---------------------------------------------------------------------------------

// Client ID and API key from the Developer Console
import { CLIENT_ID, API_KEY } from './keys.js';
 
// Array of API discovery doc URLs
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];

// ToDo: Can metadata be removed?  Update SCOPES to be just what is needed
// Including Metadata for all files and, BEWARE!, see/edit/create for complete drive 
const SCOPES = 'https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/drive';
 

export default class GoogleDrive {
  constructor(statusCallback) {
    this.initClient = this.initClient.bind(this);
    this.updateSigninStatus = this.updateSigninStatus.bind(this);
    this.statusCallback = statusCallback;
  }

  initialize() {
    console.log("Init",CLIENT_ID,API_KEY)
    gapi.load('client:auth2', this.initClient);
  }
  
  // initialize the API client library and set up signin listener
  initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    }).then( () => {
      console.log("setting up listen")
        gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSigninStatus);
        this.statusCallback(gapi.auth2.getAuthInstance().isSignedIn.get());
    }, function(error) {
        alert(JSON.stringify(error, null, 2));
    });
  }

  updateSigninStatus(isSignedIn) {
    console.log("Update Signed in status",isSignedIn);
    this.statusCallback(isSignedIn)
  }

  signIn() {
    console.log("Drive signin")
    gapi.auth2.getAuthInstance().signIn();
  }

  signOut() {
    gapi.auth2.getAuthInstance().signOut();
  } 

  isSignedIn() {
    return gapi.auth2.getAuthInstance().isSignedIn.get()
  }

  getDirectory(nFiles, cb) {
    // up to 100 files will be listed, use pagesize parm to customize
    gapi.client.drive.files.list({
      'fields': "files(id, mimeType, name)"
    }).then(function(response) {
      cb(response.result.files);
    });
  }

//   readFile(fileId, cb) {
//     gapi.client.drive.files.get({
//       "fileId": fileId,
//       "alt": "media"
//     })
//     .then(function(response) {
//                 // Handle the results here (response.result has the parsed body).
//                 cb(response.body);
//               },
//               function(err) { console.error("Execute error", err); });
//     )   
//   }
}

