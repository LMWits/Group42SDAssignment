fetch("http://localhost:3000/files")
        .then(response => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then(files => {
          fileDisplay.innerHTML = ""; // Clear old results
  
          files.forEach((file,i) => {
            const fileCard = document.createElement("div");
            fileCard.style.border = "1px solid #ccc";
            fileCard.style.margin = "10px";
            fileCard.style.padding = "10px";
            fileCard.style.borderRadius = "6px";
            fileCard.style.backgroundColor = "#f9f9f9";
  
            fileCard.innerHTML = `
              <strong>Title:</strong> ${file.title}<br>
              <strong>Type:</strong> ${file.type}<br>
              <strong>Year:</strong> ${file.year}<br>
              <strong>Path:</strong> ${file.path.join(" / ")}<br><br>
              <button class="infoBtn" data-index="${i}">More Info</button>
            `;
  
            fileDisplay.appendChild(fileCard);
          });

          // Attach event listeners to all "More Info" buttons
            document.querySelectorAll(".infoBtn").forEach(btn => {
                btn.addEventListener("click", (e) => {
                const index = e.target.dataset.index;
                const file = files[index];
            
                // Store file data in localStorage
                localStorage.setItem("selectedFile", JSON.stringify(file));
            
                // Navigate to details.html
                window.location.href = "details.html";
                });
            });
        })
        .catch(error => {
          fileDisplay.innerHTML = "<p style='color:red;'>Error loading files from server.</p>";
          console.error("Fetch error:", error);
        });

document.addEventListener("DOMContentLoaded", () => {
    const organiseBtn = document.querySelector(".organiseBtn");
    const fileDisplay = document.getElementById("fileDisplay");
  
    organiseBtn.addEventListener("click", () => {
      fetch("http://localhost:3000/files")
        .then(response => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then(files => {
          fileDisplay.innerHTML = ""; // Clear old results
  
          files.forEach((file,i) => {
            const fileCard = document.createElement("div");
            fileCard.style.border = "1px solid #ccc";
            fileCard.style.margin = "10px";
            fileCard.style.padding = "10px";
            fileCard.style.borderRadius = "6px";
            fileCard.style.backgroundColor = "#f9f9f9";
  
            fileCard.innerHTML = `
              <strong>Title:</strong> ${file.title}<br>
              <strong>Type:</strong> ${file.type}<br>
              <strong>Year:</strong> ${file.year}<br>
              <strong>Path:</strong> ${file.path.join(" / ")}<br><br>
              <button class="infoBtn" data-index="${i}">More Info</button>
            `;
  
            fileDisplay.appendChild(fileCard);
          });

          // Attach event listeners to all "More Info" buttons
            document.querySelectorAll(".infoBtn").forEach(btn => {
                btn.addEventListener("click", (e) => {
                const index = e.target.dataset.index;
                const file = files[index];
            
                // Store file data in localStorage
                localStorage.setItem("selectedFile", JSON.stringify(file));
            
                // Navigate to details.html
                window.location.href = "details.html";
                });
            });
        })
        .catch(error => {
          fileDisplay.innerHTML = "<p style='color:red;'>Error loading files from server.</p>";
          console.error("Fetch error:", error);
        });
    });
  });
  