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
    const fileType = file.type;

    if (fileType.startsWith('image/') || fileType === 'video/mp4') {
        const element = document.createElement(fileType.startsWith('image/') ? 'img' : 'video');
        element.src = URL.createObjectURL(file);
        element.style.display = 'none';
        document.body.appendChild(element);

        element.addEventListener('loadedmetadata', function () {
            const width = this.videoWidth || this.width;
            const height = this.videoHeight || this.height;
            const scale = window.devicePixelRatio || 1;
            document.body.removeChild(element);

            gifsDiv.innerHTML = `
                <div class="gif-wrapper">
                    <p>${file.name}</p>
                    <p class="gif-resolution">${width} x ${height}</p>
                    <div class="gif-container" style="width: ${width / scale}px; height: ${height / scale}px;">
                        <${fileType.startsWith('image/') ? 'img' : 'video'} id="mediaElement" src="${URL.createObjectURL(file)}" width="${width / scale}" height="${height / scale}"></${fileType.startsWith('image/') ? 'img' : 'video'}>
                    </div>
                    ${fileType === 'video/mp4' ? '<button id="playPauseBtn">Play</button>' : ''}
                </div>
            `;
            fileLabel.textContent = 'Select new';
            fileLabel.onclick = clearImage;

            if (fileType === 'video/mp4') {
                const videoElement = document.getElementById('mediaElement');
                const playPauseBtn = document.getElementById('playPauseBtn');

                playPauseBtn.addEventListener('click', () => {
                    if (videoElement.paused) {
                        videoElement.play();
                        playPauseBtn.textContent = 'Pause';
                    } else {
                        videoElement.pause();
                        playPauseBtn.textContent = 'Play';
                    }
                });
            }
        });

        if (fileType === 'image/jpeg' || fileType === 'image/jpg' || fileType === 'image/png' || fileType === 'image/gif') {
            element.addEventListener('load', function () {
                this.dispatchEvent(new Event('loadedmetadata'));
            });
        }

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
