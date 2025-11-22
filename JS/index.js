// Function to create a thumbnail with overlay icons
let gradientIndex = 0; // Глобальный счётчик для градиентов
function createThumbnail(src, alt, galleryPageUrl, hasMultipleImages, hasVideo, hasYouTube, hasSketchfab, isLarge) {
    const thumbnailLink = document.createElement("a");
thumbnailLink.href = galleryPageUrl;
thumbnailLink.classList.add("thumbnail-link");

if (isLarge) {
    thumbnailLink.classList.add("thumbnail-large-link");
}

    console.log(`Создан thumbnail: ${alt}, isLarge: ${isLarge}`);

    const thumbnailDiv = document.createElement("div");
    thumbnailDiv.classList.add("thumbnail");

    const gradientClasses = ["gradient-green", "gradient-blue", "gradient-pink", "gradient-orange"];

    // Берём цвет по порядку и увеличиваем счётчик
    const assignedGradient = gradientClasses[gradientIndex % gradientClasses.length];
    gradientIndex++; // Увеличиваем индекс для следующего thumbnail
    
    // Применяем градиент к `thumbnailDiv`
    thumbnailDiv.classList.add(assignedGradient);
    


   if (isLarge && !thumbnailDiv.classList.contains("thumbnail-large")) {
    console.log("Добавляем класс thumbnail-large к:", alt);
    thumbnailDiv.classList.add("thumbnail-large");
}
   
    const thumbnailImg = document.createElement("img");
    thumbnailImg.src = src;
    thumbnailImg.alt = alt;

    const thumbnailTitle = document.createElement("div");
    thumbnailTitle.classList.add("thumbnail-title");
    thumbnailTitle.innerText = alt;

    let iconIndex = 0;

    if (hasMultipleImages) {
        const multipleImagesIcon = document.createElement("i");
        multipleImagesIcon.className = "fa-solid fa-layer-group overlay-icon";
        multipleImagesIcon.style.left = `${10 + iconIndex * 30}px`;
        thumbnailDiv.appendChild(multipleImagesIcon);
        iconIndex++;
    }

    if (hasVideo) {
        const videoIcon = document.createElement("i");
        videoIcon.className = "fa-solid fa-video overlay-icon";
        videoIcon.style.left = `${10 + iconIndex * 30}px`;
        thumbnailDiv.appendChild(videoIcon);
        iconIndex++;
    }

    if (hasYouTube) {
        const youtubeIcon = document.createElement("i");
        youtubeIcon.className = "fa-brands fa-youtube overlay-icon";
        youtubeIcon.style.left = `${10 + iconIndex * 30}px`;
        thumbnailDiv.appendChild(youtubeIcon);
        iconIndex++;
    }

    if (hasSketchfab) {
        const sketchfabIcon = document.createElement("i");
        sketchfabIcon.className = "fa-solid fa-cube overlay-icon";
        sketchfabIcon.style.left = `${10 + iconIndex * 30}px`;
        thumbnailDiv.appendChild(sketchfabIcon);
        iconIndex++;
    }

    thumbnailDiv.appendChild(thumbnailImg);
    thumbnailDiv.appendChild(thumbnailTitle);
    thumbnailLink.appendChild(thumbnailDiv);

    return thumbnailLink;
}

// Get the thumbnail container element
const thumbnailContainer = document.getElementById("thumbnail-container");

// Function to fetch and parse the description.txt file
function fetchProjectData(projectName) {
    console.log("Загружаем проект:", projectName);
    const isLarge = projectName.startsWith("*"); // Проверяем, начинается ли название с "*"
    const cleanProjectName = projectName.replace("*", "").trim(); // Убираем "*" из имени проекта

    const descriptionPath = `../Projects/${cleanProjectName}/description.txt`;
    const mediaPath = `../Projects/${cleanProjectName}/media.txt`;

    

    return Promise.all([
        fetch(descriptionPath).then(response => response.text()),
        fetch(mediaPath).then(response => response.text())
    ])
    .then(([descriptionText, mediaText]) => {
        const [title, description, tags, thumbnailUrl, htmlFileName] = descriptionText.split('---').map(line => line.trim());
        const galleryPageUrl = descriptionPath.replace('description.txt', htmlFileName);

        const mediaLines = mediaText.split('\n').map(line => line.trim()).filter(line => line && !line.startsWith('#'));
        const hasMultipleImages = mediaLines.filter(line => line.match(/\.(jpeg|jpg|gif|png)$/)).length > 1;
        const hasVideo = mediaLines.some(line => line.match(/\.(mp4)$/));
        const hasYouTube = mediaLines.some(line => line.includes('youtube.com'));
        const hasSketchfab = mediaLines.some(line => line.includes('sketchfab.com'));

        const isLarge = projectName.startsWith("*"); // Проверяем, начинается ли название с "*"
        const cleanProjectName = projectName.replace("*", "").trim(); // Убираем "*" из имени проекта


        return { 
            src: thumbnailUrl, 
            alt: title, 
            galleryPageUrl, 
            hasMultipleImages, 
            hasVideo, 
            hasYouTube, 
            hasSketchfab, 
            isLarge
        };
    })
    .catch(error => console.error('Error loading project data:', error));
}


// Function to fetch the projects.txt file
function fetchProjects() {
    return fetch('../Config/projects.txt')
        .then(response => response.text())
        .then(text => text.split('\n').map(line => line.trim()).filter(line => line))
        .catch(error => console.error('Error loading projects:', error));
}

fetchProjects().then(projects => {
    let bannerImageSet = false;
    const fragment = document.createDocumentFragment();

    // Гарантируем, что список проектов будет загружен в том же порядке, что в файле
    const fetchProjectDataPromises = projects.map((projectName, index) => {
        return fetchProjectData(projectName).then(artwork => {
            return { index, artwork }; // Запоминаем исходный индекс
        }).catch(error => {
            console.error(`Error loading data for project: ${projectName}`, error);
            return null;
        });
    });

    Promise.all(fetchProjectDataPromises).then(results => {
        results
            .filter(item => item !== null) // Исключаем ошибки
            .sort((a, b) => a.index - b.index) // Сортируем по изначальному индексу
            .forEach(({ artwork }) => {
                console.log("Создаётся превью:", artwork);
                const thumbnail = createThumbnail(
                    artwork.src,
                    artwork.alt,
                    artwork.galleryPageUrl,
                    artwork.hasMultipleImages,
                    artwork.hasVideo,
                    artwork.hasYouTube,
                    artwork.hasSketchfab,
                    artwork.isLarge // Передаём информацию о размере
                );
                fragment.appendChild(thumbnail);
            });

        thumbnailContainer.appendChild(fragment);
    });
});



