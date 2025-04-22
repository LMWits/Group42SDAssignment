document.addEventListener("DOMContentLoaded", () => {
    const folder = localStorage.getItem("currentFolder");

    if (!folder) {
        folderName.textContent = "No folder selected.";
      return;
    }else{
        folderName.textContent = `Folder: ${folder}`;
    }

    /*
    1. fetch files in the clicked folder
    notes:  function encodeURIComponent() safely encodes a string so it can be used in a URL
            It converts special characters (like spaces, slashes, or symbols) 
            into something that won’t break the URL format
            eg.) "Constitutional Documents" or "South Africa/1994" would break URL
    */
    console.log("Folder being fetched:", folder); //remove
    console.log("Fetch URL:", `http://localhost:3000/folder/files/${encodeURIComponent(folder)}`); //remove

    fetch(`http://localhost:3000/folder/files/${encodeURIComponent(folder)}`) 
    .then(res => {
        if (!res.ok) throw new Error(`Server responded with ${res.status}`);
        return res.json();
      })
    .then(files => {
        console.log("Files fetched:", files); //remove

        if (files.length === 0) {
            folderDisplay.innerHTML = "<p>No files in this folder.</p>";
            return;
        }

      fileDisplay.innerHTML = "<h2>Files</h2>";

      files.forEach((file, i) => {
        const fileCard = document.createElement("div");
        fileCard.style.border = "1px solid #ccc";
        fileCard.style.margin = "10px";
        fileCard.style.padding = "10px";
        fileCard.style.borderRadius = "6px";
        fileCard.style.backgroundColor = "#f9f9f9";

        fileCard.innerHTML = `
          <strong>Title:</strong> ${file.title}<br>
          <strong>Description:</strong> ${file.description}<br>
          <strong>Uploaded:</strong> ${new Date(file.uploadDate).toLocaleDateString()}<br>
          <strong>Path:</strong> ${file.path?.join(" / ") || "None"}<br><br> 
          <!-- 
          <a href="${file.blobUrl}" target="_blank">🔗 View File</a><br><br>
          -->
          <button class="infoBtn" data-index="${i}">More Info</button>
        `;

        fileDisplay.appendChild(fileCard); //add html of fileCard to the <div> called fileDisplay
      });
    })
    .catch(err => {
        folderDisplay.innerHTML = "<p style='color:red;'>Error loading files</p>";
        console.error(err);
    });

    /*
        2. Fetches all top level folders (in this specified folder)
        Displays them in folderDsiplay <div > found in <main> in adminHP.html 
    */

    fetch(`http://localhost:3000/folders/${encodeURIComponent(folder)}`)
        .then(response => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then(folders => {

          folderDisplay.innerHTML = `<h2>All folders in ${folder}</h2>`;
  
          folders.forEach(folder => {
            const folderDiv = document.createElement("div"); //create a <div> for each folder
            folderDiv.textContent = folder; //adds folder name stored in folder as text to <div> created in line above
            folderDiv.className = "folder";
            folderDiv.style.margin = "10px";
            folderDiv.style.padding = "10px";
            folderDiv.style.border = "1px solid #888";
            folderDiv.style.borderRadius = "6px";
            folderDiv.style.backgroundColor = "#eef";
            folderDiv.style.cursor = "pointer";
  
            //store folder name and go to folder.html when <div> clicked on
            folderDiv.addEventListener("click", () => {
              localStorage.setItem("currentFolder", folder);
              window.location.href = "folder.html";
            });

            folderDisplay.appendChild(folderDiv); //add html of folderDiv to the <div> called fileDisplay
          });

          // Check if the folders array is empty
          if (folders.length == 0) {
            folderDisplay.innerHTML = "<p>No subfolders found in this folder.</p>";
        }

        })
        .catch(error => {
          folderDisplay.innerHTML = "<p style='color:red;'>Error loading folders from server.</p>";
          console.error("Fetch error:", error);
        });    
});