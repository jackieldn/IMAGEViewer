function displayFileName(file) {
    const fileNameP = document.getElementById('fileName');
    if (file) {
        fileNameP.textContent = file.name;
    } else {
        fileNameP.textContent = '';
    }
}

function displayImage(file) {
    const gifsDiv = document.getElementById('gifs');
    const fileLabel = document.getElementById('fileLabel');
    if (file && (file.type === 'image/gif' || file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png')) {
        const tempImg = document.createElement('img');
        tempImg.src = URL.createObjectURL(file);
        tempImg.style.display = 'none';
        document.body.appendChild(tempImg);
        tempImg.addEventListener('load', function() {
            const width = this.width;
            const height = this.height;
            const scale = window.devicePixelRatio || 1;
            document.body.removeChild(tempImg);
            gifsDiv.innerHTML = `
                <div class="gif-wrapper">
                    <p>${file.name}</p>
                    <p class="gif-resolution">${width} x ${height}</p>
                    <div class="gif-container" style="width: ${width / scale}px; height: ${height / scale}px;">
                        <img id="myImage" src="${URL.createObjectURL(file)}" width="${width / scale}" height="${height / scale}">
                    </div>
                </div>
            `;
            fileLabel.textContent = 'Select new';
            fileLabel.onclick = clearImage;
        });
        displayFileName(file);
    }
}

function handleFileSelect(event) {
    event.stopPropagation();
    event.preventDefault();
    const file = event.dataTransfer ? event.dataTransfer.files[0] : event.target.files[0];
    if (file) {
        displayImage(file);
    }
}

function handleDragOver(event) {
    event.stopPropagation();
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
}

function clearImage() {
    const gifsDiv = document.getElementById('gifs');
    const fileLabel = document.getElementById('fileLabel');
    const fileNameP = document.getElementById('fileName');

    gifsDiv.innerHTML = '';
    fileNameP.textContent = '';
    fileLabel.textContent = 'File browser';
    fileLabel.onclick = null;
}

document.addEventListener('DOMContentLoaded', () => {
    const fileDropZone = document.getElementById('fileDropZone');
    fileDropZone.addEventListener('dragover', handleDragOver, false);
    fileDropZone.addEventListener('drop', handleFileSelect, false);
    document.getElementById('file1').addEventListener('change', handleFileSelect, false);
});
