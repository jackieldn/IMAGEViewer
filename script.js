document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('darkModeToggle');

    // Load the saved theme
    const savedDarkMode = localStorage.getItem('darkMode');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const darkModeEnabled = savedDarkMode === 'enabled' || (!savedDarkMode && prefersDarkScheme);

    setDarkMode(darkModeEnabled);
    toggle.checked = darkModeEnabled;

    // Toggle the theme on checkbox change
    toggle.addEventListener('change', () => {
        setDarkMode(toggle.checked);
    });

    // Handle color picker and input changes
    const colorPicker = document.getElementById('colorPicker');
    const colorInput = document.getElementById('colorInput');
    const imageDisplay = document.getElementById('gifs');

    colorPicker.addEventListener('input', () => {
        const color = colorPicker.value;
        imageDisplay.style.backgroundColor = color;
        colorInput.value = color;
    });

    colorInput.addEventListener('input', () => {
        let color = colorInput.value;
        // Automatically add '#' if it's a valid hex color without '#'
        if (/^([0-9A-F]{3}|[0-9A-F]{6})$/i.test(color)) {
            color = '#' + color;
        }
        if (isValidColor(color)) {
            imageDisplay.style.backgroundColor = color;
            colorPicker.value = color;
        }
    });

    document.querySelectorAll('.color-preset').forEach(preset => {
        preset.addEventListener('click', () => {
            const color = preset.getAttribute('data-color');
            imageDisplay.style.backgroundColor = color;
            colorInput.value = color;
            colorPicker.value = color;
        });
    });

    function isValidColor(str) {
        const s = new Option().style;
        s.color = str;
        return s.color !== '';
    }
});

function setDarkMode(isDark) {
    const elementsToToggle = document.querySelectorAll(
        'body, header, .about-btn, .file-browser, .image-display, .about, .reminder, .announcement, .announcement-box, #fileLabel, .bg-teal, .bg-primary, .color-picker-container, .color-picker, .color-input, .color-presets-container, .color-preset'
    );
    elementsToToggle.forEach(element => {
        if (isDark) {
            element.classList.add('dark-mode');
            element.classList.remove('light-mode');
        } else {
            element.classList.add('light-mode');
            element.classList.remove('dark-mode');
        }
    });
    localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
}

function handleDarkModeToggle() {
    const body = document.body;
    const darkModeIcon = document.getElementById('darkModeIcon');
    body.classList.toggle('dark-mode');
    darkModeIcon.textContent = body.classList.contains('dark-mode') ? '🌞' : '🌜'; // Toggle icons
    setDarkMode(body.classList.contains('dark-mode'));
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

document.getElementById('fileDropZone').addEventListener('dragover', handleDragOver);
document.getElementById('fileDropZone').addEventListener('drop', handleFileSelect);

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
