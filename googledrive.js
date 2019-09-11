//---------------------------------------------------------------------------------
// Drive interface using GAPI 
//---------------------------------------------------------------------------------

// Client ID and API key from the Developer Console
import { CLIENT_ID, API_KEY } from './keys.js';
 
// Array of API discovery doc URLs
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];

// Update SCOPES to be just what is needed
// Including Metadata for all files and, BEWARE!, see/edit/create for complete drive 
const SCOPES = 'https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/drive';
 
//
const DIRECTORY_OPTIONS = {
 // 'corpora': 'drive',
  'q': "mimeType!='application/vnd.google-apps.folder'", 
  'fields': "files(name, kind, mimeType, createdTime, modifiedTime, shared, webViewLink),nextPageToken",
  'trashed': 'false',
  'orderBy':'name',
  'pageSize': '25',
  'folderId': 'root'
};


export default class GoogleDrive {
  constructor(statusCallback) {
    this.nextPageToken = null;
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

  signOut(callback) {
    console.log("Drive signout");
    // NOTE: this does not log user out of google. Just says "no more drive demo for now!"
    gapi.auth2.getAuthInstance().signOut().then( () => callback() );
  } 

  isSignedIn() {
    return gapi.auth2.getAuthInstance().isSignedIn.get()
  }


  getDirectory(first, callback) {
    let options = DIRECTORY_OPTIONS;

    if (!first && this.nextPageToken!==null)
      options['pageToken'] = this.nextPageToken;

    gapi.client.drive.files.list(options)
    .then( (response) => {
      console.log('file response',response);
      this.nextPageToken = response.result.nextPageToken || null;
      callback(response.result.files,this.nextPageToken===null ? false : true);
   });
  }
}
