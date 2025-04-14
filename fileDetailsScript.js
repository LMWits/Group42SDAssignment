const file = JSON.parse(localStorage.getItem("selectedFile"));

if (file) {
    const container = document.getElementById("details");

    // Create base metadata section
    const metadata = `
    <p><strong>Title:</strong> ${file.title}</p>
    <p><strong>Type:</strong> ${file.type}</p>
    <p><strong>Year:</strong> ${file.year}</p>
    <p><strong>Path:</strong> ${file.path.join(" / ")}</p>
    `;

    // Build hierarchy section
    let hierarchyHtml = '<div class="hierarchy"> <strong>Hierarchy:</strong>'; //open div "hierarchy"

    file.path.forEach((folder, i) => {
    hierarchyHtml += `<div class="folder" style="margin-left: ${20 * (i + 1)}px">${folder}</div>`; //add div for each folder in path (under div "hierarchy") + "style=..." adds indentations based on its index
    });

    hierarchyHtml += `<div class="folder"  style="margin-left: ${20 * (file.path.length + 1)}px">${file.title}</div>`; //add div for file (under div "hierarchy") + "style=..." adds indentation based on num folders
    hierarchyHtml += '</div>'; //close div

    container.innerHTML = metadata + hierarchyHtml; //add metadata html and hierachy html to container
} else {
    document.getElementById("details").textContent = "No file selected.";
}