import GoogleDrive from './googledrive.js';

        let files=[];
        let googleDrive;
        let authorizeButton;
        /**
         *  Sign in the user upon button click.
         */
        function handleAuthClick() {
          googleDrive.signIn();
        }
  

        function showFiles(f) {
          files = f;
          document.getElementById('directory').style.display = "block";
          let table = document.getElementById('files');
          let count = table.rows.length;
          // while (count > 0) {
          //   table.deleteRow(0);
          //   --count;
          // }
          // let header = table.createTHead();
          // let headrow = header.insertRow(0);
          // let nameCol = headrow.insertCell(0);
          // let typeCol = headrow.insertCell(1);
          // let idCol = headrow.insertCell(2);                  
          // nameCol.innerHTML = "Name";
          // typeCol.innerHTML = "Type";
          // idCol.innerHTML = "Id";
          files.forEach ( (f) => {
            let row = table.insertRow();
            let c1 = row.insertCell(0);
            let c2 = row.insertCell(1);            
            let c3 = row.insertCell(2);
            c1.innerHTML = f.name;
            c2.innerHTML = f.mimeType;
            c3.innerHTML = f.id;
          })         
        }
        function googleDriveStatusChange(isSignedIn) {
          if (isSignedIn) {
            console.log("Show Menu");
            authorizeButton.style.display = 'none';            
            files = googleDrive.getDirectory(15,showFiles);
          }
          else {
            authorizeButton.style.display = 'block';
          }
        }

      // NOTE: specically waiting for window load (vs document DOMContentLoaded) to ensure google apis script available
      window.addEventListener("load", () => { 
          console.log("Document Ready");
          googleDrive = new GoogleDrive(googleDriveStatusChange);
          authorizeButton = document.getElementById('authorize_button');
          authorizeButton.onclick = handleAuthClick;       
          googleDrive.initialize();  
      });       
 