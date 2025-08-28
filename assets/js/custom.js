// Define different translation sets
        const translationSets = {
            common: [
                { word: "स्वागतम", lang: "Hindi" },
                { word: "مرحبا", lang: "Arabic" },
                { word: "欢迎你来", lang: "Chinese" },
                { word: "Willkommen", lang: "German" },
                { word: "Bienvenue", lang: "French" },
                { word: "Bem-vindo", lang: "Portuguese" },
                { word: "Добро пожаловать", lang: "Russian" },
                { word: "ようこそ", lang: "Japanese" },
                { word: "환영합니다", lang: "Korean" },
                { word: "Benvenuto", lang: "Italian" }
            ],
            asian: [
                { word: "স্বাগতম", lang: "Bengali" },
                { word: "స్వాగతం", lang: "Telugu" },
                { word: "வரவேற்பு", lang: "Tamil" },
                { word: "സ്വാഗതം", lang: "Malayalam" },
                { word: "ಸ್ವಾಗತ", lang: "Kannada" },
                { word: "ਸੁਆਗਤ ਹੈ", lang: "Punjabi" },
                { word: "Swagatam", lang: "Assamese" },
                { word: "Khosh Amadid", lang: "Persian" },
                { word: "Sawatdee", lang: "Thai" },
                { word: "Salam", lang: "Malay" }
            ],
            pacific: [
                { word: "Mabuhay", lang: "Filipino" },
                { word: "Aloha", lang: "Hawaiian" },
                { word: "Haere mai", lang: "Maori" },
                { word: "Talofa", lang: "Samoan" },
                { word: "Bula", lang: "Fijian" },
                { word: "Kia Ora", lang: "Maori" },
                { word: "Malo e lelei", lang: "Tongan" },
                { word: "Ia orana", lang: "Tahitian" },
                { word: "Fakaalofa lahi atu", lang: "Niuean" },
                { word: "Talofa lava", lang: "Samoan" }
            ]
        };

        // Colors for the words
        const colors = ['#e74c3c', '#2980b9', '#27ae60', '#f39c12', '#8e44ad', '#34495e'];
        
        // Track which clouds have been initialized
        const initializedClouds = {
            cloud1: false,
            cloud2: false,
            cloud3: false
        };

        // Function to create a word cloud
        function createWordCloud(containerId, translations) {
            const container = document.getElementById(containerId);
            const translationsContainer = container.querySelector('.translations-container');
            const mainWelcome = container.querySelector('.main-welcome');
            let placedWords = [];
            
            function checkCollision(rect1, rect2) {
                return !(
                    rect1.right < rect2.left ||
                    rect1.left > rect2.right ||
                    rect1.bottom < rect2.top ||
                    rect1.top > rect2.bottom
                );
            }
            
            function placeWords() {
                // Clear existing words and their positions
                translationsContainer.innerHTML = '';
                placedWords = [];
                
                // Create and position words
                translations.forEach((data, index) => {
                    const wordElement = document.createElement('span');
                    wordElement.textContent = data.word;
                    wordElement.classList.add('translation-word');
                    
                    // Use CSS clamp for a more robust responsive font size
                    const fontSize = Math.random() * (2.5 - 0.8) + 0.8;
                    wordElement.style.fontSize = `${fontSize}em`;
                    wordElement.style.color = colors[Math.floor(Math.random() * colors.length)];
                    
                    translationsContainer.appendChild(wordElement);
                    
                    let foundPosition = false;
                    let attempts = 0;
                    const maxAttempts = 50;
                    
                    while (!foundPosition && attempts < maxAttempts) {
                        attempts++;
                        
                        // Recalculate container and main welcome dimensions on each attempt
                        const containerRect = container.getBoundingClientRect();
                        const mainWelcomeRect = mainWelcome.getBoundingClientRect();
                        
                        const left = Math.random() * (containerRect.width - wordElement.offsetWidth);
                        const top = Math.random() * (containerRect.height - wordElement.offsetHeight);
                        
                        wordElement.style.left = `${left}px`;
                        wordElement.style.top = `${top}px`;
                        
                        const wordRect = wordElement.getBoundingClientRect();
                        let isColliding = false;
                        
                        // Check collision with the main word
                        if (checkCollision(wordRect, mainWelcomeRect)) {
                            isColliding = true;
                        }
                        
                        // Check collision with all previously placed words
                        if (!isColliding) {
                            for (const placedWord of placedWords) {
                                if (checkCollision(wordRect, placedWord.rect)) {
                                    isColliding = true;
                                    break;
                                }
                            }
                        }
                        
                        if (!isColliding) {
                            foundPosition = true;
                            placedWords.push({ element: wordElement, rect: wordElement.getBoundingClientRect() });
                            wordElement.style.animationDelay = `${Math.random() * 5}s`;
                        }
                    }
                    
                    if (!foundPosition) {
                        translationsContainer.removeChild(wordElement);
                    }
                });
            }
            
            // Mark this cloud as initialized
            initializedClouds[containerId] = true;
            
            // Initial call to place words
            placeWords();
            
            // Debounce the resize event to prevent performance issues
            let resizeTimer;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(placeWords, 200);
            });
        }
        
        // Initialize the first word cloud when DOM is loaded
        document.addEventListener('DOMContentLoaded', () => {
            createWordCloud('cloud1', translationSets.common);
            
            // Set up tab switching functionality
            const tabLinks = document.querySelectorAll('.tab-link');
            const cloudSVGs = document.querySelectorAll('.cloud-svg');

            tabLinks.forEach((btn) => {
                btn.addEventListener('click', function() {
                    // Deactivate all tabs
                    tabLinks.forEach((btn) => btn.classList.remove('active'));
                    cloudSVGs.forEach((svg) => {
                        // Hide active-circles group by default
                        const activeGroup = svg.querySelector('.active-circles');
                        if (activeGroup) {
                            activeGroup.style.display = 'none';
                        }
                    });

                    // Activate the clicked tab and show corresponding SVG's active-circles
                    this.classList.add('active');
                    const targetTab = this.getAttribute('data-tab');
                    const svg = document.querySelector(`[data-tab="${targetTab}"]`);
                    const activeGroup = svg.querySelector('.active-circles');
                    if (activeGroup) {
                        activeGroup.style.display = 'block';
                    }

                    // Switch tab content
                    const targetContent = document.getElementById(targetTab);
                    const tabContents = document.querySelectorAll('.tab-content');
                    tabContents.forEach((content) => content.classList.remove('active'));
                    targetContent.classList.add('active');
                    
                    // Initialize the word cloud for this tab if it hasn't been initialized yet
                    if (targetTab === 'tab1' && !initializedClouds.cloud1) {
                        createWordCloud('cloud1', translationSets.common);
                    } else if (targetTab === 'tab2' && !initializedClouds.cloud2) {
                        createWordCloud('cloud2', translationSets.asian);
                    } else if (targetTab === 'tab3' && !initializedClouds.cloud3) {
                        createWordCloud('cloud3', translationSets.pacific);
                    }
                });
            });
        });