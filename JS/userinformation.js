function addUserInformation() {
    // Определяем путь к txt с данными
    let basePath = '';
    if (window.location.pathname.includes('/Projects/')) {
        basePath = '../../Config/userinformation.txt';
    } else if (window.location.pathname.includes('/HTML/')) {
        basePath = '../Config/userinformation.txt';
    } else {
        basePath = 'Config/userinformation.txt';
    }

    fetch(basePath)
        .then(response => response.text())
        .then(data => {
            const lines = data.split('\n').map(line => line.trim());
            const [profilePicUrl, profileName, profileRole, location, ...socials] = lines;

            const userInfoPanel = document.querySelector('.user-info-panel');
            if (!userInfoPanel) return;

            // путь к 3D модели в зависимости от того, где мы находимся
            let modelPath = '';
            if (window.location.pathname.includes('/Projects/')) {
                modelPath = '../../Resources/Models/TonyaAvatar.glb';
            } else if (window.location.pathname.includes('/HTML/')) {
                modelPath = '../Resources/Models/TonyaAvatar.glb';
            } else {
                modelPath = 'Resources/Models/TonyaAvatar.glb';
            }


            // === AVATAR BLOCK (2D + 3D) ===
            let avatarContainer = userInfoPanel.querySelector('.avatar');
            if (!avatarContainer) {
                avatarContainer = document.createElement("div");

                // !!! ВЫБЕРИ РЕЖИМ: 
                // avatar--image = картинка
                // avatar--3d = 3D TonyaAvatar.glb
                avatarContainer.className = "avatar avatar--3d";

                avatarContainer.innerHTML = `
                    <!-- 2D Avatar -->
                    <img 
                        src="${profilePicUrl}" 
                        alt="Avatar" 
                        class="avatar-image"
                    />

                    <!-- 3D Avatar -->
                    <model-viewer
                        src="${modelPath}"
                        alt="3D avatar"
                        class="avatar-3d"
                        disable-zoom
                        disable-tap
                        interaction-prompt="none"
                        shadow-intensity="0"
                        exposure="1"
                        camera-orbit="0deg 90deg 5.0m"
                        field-of-view="30deg"
                    ></model-viewer>




                `;




                
                userInfoPanel.prepend(avatarContainer);


                // === Mouse + idle driven rotation (горизонталь + вертикаль) ===
                const viewer = avatarContainer.querySelector("model-viewer");

                if (viewer) {
                    let targetAzimuth = 0;      // поворот влево/вправо
                    let targetElevation = 90;   // наклон вверх/вниз (90 = прямо)
                    let lastMoveTime = performance.now();

                    // реакция на движение мыши
                    window.addEventListener("mousemove", (e) => {
                        const percentX = e.clientX / window.innerWidth;    // 0 → 1
                        const percentY = e.clientY / window.innerHeight;   // 0 → 1

                        // целевые углы на основе позиции мыши
                        const mouseAz = (0.5 - percentX) * 75;             // -20...+20
                        const mouseEl = 90 + (0.5 - percentY) * 75;        // 90 +/- 20

                        // вместо резкого перехода — плавное притяжение к позиции мыши
                        const followSpeed = 0.1; // 0.1–0.2 — комфортно, можно крутить

                        targetAzimuth = targetAzimuth * (1 - followSpeed) + mouseAz * followSpeed;
                        targetElevation = targetElevation * (1 - followSpeed) + mouseEl * followSpeed;

                        lastMoveTime = performance.now();
                    });



                    const animate = () => {
                        if (!viewer) return;

                        const current = viewer.getAttribute("camera-orbit") || "0deg 90deg 5.0m";
                        const [azStr, elStr, rStr] = current.split(" ");

                        let az = parseFloat(azStr);
                        let el = parseFloat(elStr);

                        const now = performance.now();
                        const idleTime = (now - lastMoveTime) / 1000; // сек с последнего движения

                        // лёгкий idle: небольшое дыхание вокруг цели
                        const idleAz = Math.sin(now * 0.0015) * 6;   // ±3°
                        const idleEl = Math.cos(now * 0.0013) * 4;   // ±2°

                        // ЕСЛИ МЫШЬ ДАВНО НЕ ДВИГАЛАСЬ — плавно тянем цели к центру (0, 90)
                        if (idleTime > 1.5) {
                            targetAzimuth *= 0.975;                             // стремится к 0
                            targetElevation = 90 + (targetElevation - 90) * 0.975; // к 90
                        }

                        const desiredAz = targetAzimuth + idleAz;
                        const desiredEl = targetElevation + idleEl;

                        // плавное приближение текущих значений к desired
                        az = az * 0.9 + desiredAz * 0.1;
                        el = el * 0.9 + desiredEl * 0.1;

                        viewer.setAttribute(
                            "camera-orbit",
                            `${az.toFixed(2)}deg ${el.toFixed(2)}deg 5.0m`
                        );

                        requestAnimationFrame(animate);
                    };

                    animate();
                }



            }


            // --- текстовый блок слева ---
            let userInfoText = userInfoPanel.querySelector('.user-info-text');
            if (!userInfoText) {
                userInfoText = document.createElement('div');
                userInfoText.className = 'user-info-text';

                // вставляем текст ПЕРЕД навигацией, если она есть
                const nav = userInfoPanel.querySelector('.navigation-buttons');
                if (nav) {
                    userInfoPanel.insertBefore(userInfoText, nav);
                } else {
                    userInfoPanel.appendChild(userInfoText);
                }
            }
            // чистим только текст, навигацию не трогаем
            userInfoText.innerHTML = '';


            // === Имя (ссылка) ===
            const userNameLink = document.createElement('a');
            userNameLink.href = '../../index.html';
            userNameLink.className = 'user-name-link';

            const userName = document.createElement('h1');
            userName.className = 'user-name';
            userName.textContent = profileName;
            userNameLink.appendChild(userName);
            userInfoText.appendChild(userNameLink);



            // === Роль ===
            const userRole = document.createElement('h2');
            userRole.textContent = profileRole;
            userInfoText.appendChild(userRole);

            // === Локация ===
            const userLocationContainer = document.createElement('div');
            userLocationContainer.className = 'user-location-container';

            const locationIcon = document.createElement('span');
            locationIcon.className = 'material-symbols-outlined';
            locationIcon.textContent = 'near_me';
            userLocationContainer.appendChild(locationIcon);

            const userLocation = document.createElement('h2');
            userLocation.textContent = location;
            userLocationContainer.appendChild(userLocation);

            userInfoText.appendChild(userLocationContainer);

            // === Соцсети ===
            const socialIcons = document.createElement('div');
            socialIcons.className = 'social-icons';
            userInfoText.appendChild(socialIcons);

            const socialIconMap = {
                'x.com': 'fa-brands fa-x-twitter',
                'facebook.com': 'fa-brands fa-square-facebook',
                'discord.com': 'fa-brands fa-discord',
                'discord.gg': 'fa-brands fa-discord',
                'dsc.gg': 'fa-brands fa-discord',
                'instagram.com': 'fa-brands fa-instagram',
                'youtube.com': 'fa-brands fa-youtube',
                'linkedin.com': 'fab fa-linkedin',
                'artstation.com': 'fa-brands fa-artstation',
                'github.com': 'fab fa-github',
                'wordpress.com': 'fab fa-wordpress',
                'vimeo.com': 'fab fa-vimeo',
                'behance.net': 'fab fa-behance',
                'playstation.com': 'fab fa-playstation',
                'xbox.com': 'fab fa-xbox',
                'vk.com': 'fab fa-vk',
                'steamcommunity.com': 'fab fa-steam',
                'tumblr.com': 'fab fa-tumblr',
                'threads.net': 'fab fa-threads',
                'patreon.com': 'fab fa-patreon',
                'twitch.tv': 'fab fa-twitch',
                'mixer.com': 'fab fa-mixer',
                'mastodon.social': 'fab fa-mastodon',
                'mailchimp.com': 'fab fa-mailchimp',
                'email': 'fas fa-envelope'
            };

            socials.forEach(social => {
                let iconClass;
                let url = social;

                const socialType = Object.keys(socialIconMap).find(key => social.includes(key)) || 'email';
                iconClass = socialIconMap[socialType];
                if (socialType === 'email') {
                    url = `mailto:${social}`;
                }

                if (iconClass) {
                    const a = document.createElement('a');
                    a.href = url;
                    a.target = '_blank';
                    const icon = document.createElement('i');
                    icon.className = iconClass;
                    a.appendChild(icon);
                    socialIcons.appendChild(a);
                }
            });
        })
        .catch(error => console.error('Error loading user information:', error));
}

document.addEventListener('DOMContentLoaded', addUserInformation);
