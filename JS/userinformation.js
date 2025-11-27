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

            // --- аватар справа ---
            let img = userInfoPanel.querySelector('.profile-pic');
            if (!img) {
                img = document.createElement('img');
                img.className = 'profile-pic';
                userInfoPanel.appendChild(img);
            }
            img.src = profilePicUrl;
            img.alt = 'Profile Picture';

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
