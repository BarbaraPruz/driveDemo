import GoogleDrive from './googledrive.js';

let googleDrive;  // google SDK

let authorizeButton;
let logoutButton;
let nextButton;
let filesTable;

// --------------------------------
// Button Callbacks
//---------------------------------
function handleAuthClick() {
  googleDrive.signIn();
} 

function handleLogoutClick() {
  googleDrive.signOut(()=> {
    console.log('sign out');
    authorizeButton.classList.remove('no-display');            
    logoutButton.classList.add('no-display');
    nextButton.classList.add('no-display')
    filesTable.classList.add('no-display')
  });
}  
  
function handleNextClick() {
  googleDrive.getDirectory(false,showFiles)
}

//--------------------------------
// File Directory Table functions
//--------------------------------
function createHeader(table,fields) {
  let thead = table.createTHead();
  let row = thead.insertRow();
  fields.forEach ( (column) => {
    let th = document.createElement("th");
    let text = document.createTextNode(column);
    th.appendChild(text);
    row.appendChild(th);
  })
}
      
function createChildNode (document, key,value) {
  switch (key) {
    case 'modifiedTime':
      let date = new Date(value);
      return document.createTextNode(date.toLocaleString());
    case 'webViewLink':
      let link = document.createElement("a");
      link.setAttribute("href", value)
      let linkText = document.createTextNode("View");
      link.appendChild(linkText);
      return link;
    default:
       return document.createTextNode(value);
  }
}

function showFiles(files,moreFlag) {
  const HEADINGS = ['dir','name','last modified','type','shared','view link'];
  const COLUMNS = ['kind','name','modifiedTime','mimeType','shared','webViewLink'];

  if (moreFlag)
    nextButton.classList.remove("no-display");
  else
    nextButton.classList.add("no-display");

  filesTable.innerHTML = "";
  createHeader(filesTable, HEADINGS);
  for (let file of files) {
    let row = filesTable.insertRow();
    COLUMNS.forEach ( (column) => {
      let cell = row.insertCell();
      let node = createChildNode(document,column,file[column]);
      cell.appendChild(node);
    } )
  }      
}

// Script set up and do it!
function googleDriveStatusChange(isSignedIn) {
  if (isSignedIn) {
    console.log("signed in - show directory");
    authorizeButton.classList.add("no-display");            
    logoutButton.classList.remove("no-display");
    googleDrive.getDirectory(true,showFiles);
  }
}

// NOTE: specically waiting for window load (vs document DOMContentLoaded) to ensure google apis script available
window.addEventListener("load", () => { 
  googleDrive = new GoogleDrive(googleDriveStatusChange);
  authorizeButton = document.getElementById('authorize_button');
  authorizeButton.onclick = handleAuthClick;   
  logoutButton = document.getElementById('logout_button');
  logoutButton.onclick = handleLogoutClick;  
  nextButton = document.getElementById('next_button');
  nextButton.onclick = handleNextClick;  
  filesTable = document.getElementById('files_table');            
  googleDrive.initialize();  
});       
 