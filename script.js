// Initialize all the custom new tab features
function initializeNewTab() {
    // Clock initialization
    updateClock();
    setInterval(updateClock, 60000);
    
    // Event listeners for search
    document.getElementById('searchInput')?.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    document.getElementById('searchButton')?.addEventListener('click', performSearch);
    
    // Initialize other components
    initializeSettings();
    
    // Additional initializations for existing functionality
    const calendar = new Calendar();
    calendar.render();
    
    // Listen for storage changes to apply settings without reload
    chrome.storage.onChanged.addListener(function(changes, namespace) {
        if (namespace === 'sync') {
            // Handle custom background changes
            if (changes.customBackground) {
                const newBackground = changes.customBackground.newValue;
                if (newBackground) {
                    document.body.style.backgroundImage = `url(${newBackground})`;
                    document.body.style.backgroundSize = 'cover';
                    document.body.style.backgroundPosition = 'center';
                } else {
                    // Reset to default if background is removed
                    document.body.style.backgroundImage = '';
                }
            }
        }
    });
}

// Clock functionality
function updateClock() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    document.getElementById('clock').textContent = `${hours}:${minutes}`;
}

// Search functionality
const searchEngines = {
    google: 'https://www.google.com/search?q=',
    bing: 'https://www.bing.com/search?q=',
    duckduckgo: 'https://duckduckgo.com/?q=',
    yahoo: 'https://search.yahoo.com/search?p='
};

function performSearch() {
    const query = document.getElementById('searchInput').value.trim();
    const engine = document.getElementById('searchEngine').value;

    if (query) {
        const searchUrl = searchEngines[engine] + encodeURIComponent(query);
        window.location.href = searchUrl;
    }
}

// Lunar calendar conversion (simplified)
function getLunarDate(solarDate) {
    // This is a simplified lunar date calculation
    // In a real implementation, you'd use a proper lunar calendar library
    const day = solarDate.getDate();
    const month = solarDate.getMonth() + 1;

    // Mock lunar date for demonstration
    const lunarDay = Math.floor(day * 0.97) + 1;
    const lunarMonth = month;

    return `${lunarDay}/${lunarMonth}`;
}

// Calendar functionality
class Calendar {
    constructor() {
        this.currentDate = new Date();
        this.today = new Date();
        this.monthNames = [
            'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
            'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
        ];
        this.dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
        this.render();
    }

    render() {
        this.renderHeader();
        this.renderDays();
    }

    renderHeader() {
        const title = document.getElementById('calendarTitle');
        title.textContent = `${this.monthNames[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
    }

    renderDays() {
        const grid = document.getElementById('calendarGrid');
        grid.innerHTML = '';

        // Add day headers
        this.dayNames.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'calendar-day-header';
            dayHeader.textContent = day;
            grid.appendChild(dayHeader);
        });

        // Get first day of month and number of days
        const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
        const lastDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        // Generate 42 days (6 weeks)
        for (let i = 0; i < 42; i++) {
            const cellDate = new Date(startDate);
            cellDate.setDate(startDate.getDate() + i);

            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';

            if (cellDate.getMonth() !== this.currentDate.getMonth()) {
                dayElement.classList.add('other-month');
            }

            if (cellDate.toDateString() === this.today.toDateString()) {
                dayElement.classList.add('today');
            }

            const solarDay = document.createElement('div');
            solarDay.textContent = cellDate.getDate();
            dayElement.appendChild(solarDay);

            const lunarDay = document.createElement('div');
            lunarDay.className = 'lunar-date';
            lunarDay.textContent = getLunarDate(cellDate);
            dayElement.appendChild(lunarDay);

            grid.appendChild(dayElement);
        }
    }

    previousMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        this.render();
    }

    nextMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        this.render();
    }
}

// Helper function to get favicon URL with improved fallback handling
function getFaviconUrl(url) {
    try {
        const domain = new URL(url).hostname;
        // Return a function that provides multiple fallback options
        return {
            primary: `https://www.google.com/s2/favicons?domain=${domain}&sz=32`,
            fallback1: `https://icon.horse/icon/${domain}`,
            fallback2: `https://www.google.com/s2/favicons?domain=${domain}`, // Try without size
            default: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1zbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiByeD0iNCIgZmlsbD0iIzk5OTk5OSIvPgo8cGF0aCBkPSJNNSA2SDE0TTUgMTBIMTEiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPC9zdmc+',
        };
    } catch (e) {
        // Default favicon for invalid URLs
        return {
            primary: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1zbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiByeD0iNCIgZmlsbD0iIzk5OTk5OSIvPgo8cGF0aCBkPSJNNSA2SDE0TTUgMTBIMTEiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPC9zdmc+',
        };
    }
}

// Helper function to apply favicon with fallbacks
function applyFaviconWithFallbacks(imgElement, url) {
    const faviconUrls = getFaviconUrl(url);
    
    imgElement.onerror = function() {
        // Try first fallback
        if (this.src === faviconUrls.primary) {
            this.src = faviconUrls.fallback1;
        } 
        // Try second fallback
        else if (this.src === faviconUrls.fallback1) {
            this.src = faviconUrls.fallback2;
        } 
        // Use default
        else {
            this.src = faviconUrls.default;
            // Remove onerror to prevent infinite loop
            this.onerror = null;
        }
    };
    
    // Start with primary URL
    imgElement.src = faviconUrls.primary;
}

// Load bookmarks
function loadBookmarks() {
    if (typeof chrome !== 'undefined' && chrome.bookmarks) {
        chrome.bookmarks.getTree((bookmarkTree) => {
            const bookmarksBar = document.getElementById('bookmarksBar');
            bookmarksBar.innerHTML = '';

            // Find bookmarks bar folder
            const bookmarksBarFolder = bookmarkTree[0].children.find(folder => folder.id === '1');

            if (bookmarksBarFolder && bookmarksBarFolder.children) {
                bookmarksBarFolder.children.forEach(bookmark => {
                    if (bookmark.url) {
                        const bookmarkElement = document.createElement('a');
                        bookmarkElement.className = 'bookmark-item';
                        bookmarkElement.href = bookmark.url;

                        // Create favicon with improved fallback
                        const favicon = document.createElement('img');
                        favicon.className = 'bookmark-icon';
                        applyFaviconWithFallbacks(favicon, bookmark.url);

                        bookmarkElement.appendChild(favicon);

                        const bookmarkTitle = document.createElement('span');
                        bookmarkTitle.innerText = bookmark.title || 'Untitled';
                        
                        bookmarkElement.appendChild(bookmarkTitle);
                        bookmarksBar.appendChild(bookmarkElement);
                    }
                });
            }

            if (bookmarksBar.children.length === 0) {
                bookmarksBar.innerHTML = '<div class="bookmark-item">Không có bookmark nào</div>';
            }
        });
    } else {
        // Enhanced mock bookmarks for demo with real favicons
        const mockBookmarks = [
            { title: 'Gmail', url: 'https://gmail.com', domain: 'gmail.com' },
            { title: 'YouTube', url: 'https://youtube.com', domain: 'youtube.com' },
            { title: 'GitHub', url: 'https://github.com', domain: 'github.com' },
            { title: 'Stack Overflow', url: 'https://stackoverflow.com', domain: 'stackoverflow.com' },
            { title: 'Reddit', url: 'https://reddit.com', domain: 'reddit.com' },
            { title: 'Twitter', url: 'https://twitter.com', domain: 'twitter.com' },
            { title: 'Facebook', url: 'https://facebook.com', domain: 'facebook.com' },
            { title: 'LinkedIn', url: 'https://linkedin.com', domain: 'linkedin.com' }
        ];

        const bookmarksBar = document.getElementById('bookmarksBar');
        bookmarksBar.innerHTML = '';

        mockBookmarks.forEach(bookmark => {
            const bookmarkElement = document.createElement('a');
            bookmarkElement.className = 'bookmark-item';
            bookmarkElement.href = bookmark.url;

            const favicon = document.createElement('img');
            favicon.className = 'bookmark-icon';
            applyFaviconWithFallbacks(favicon, bookmark.url);

            bookmarkElement.appendChild(favicon);
            bookmarkElement.appendChild(document.createTextNode(bookmark.title));

            bookmarksBar.appendChild(bookmarkElement);
        });
    }
}

// Load browsing history
function loadHistory() {
    const historyContainer = document.getElementById('historyAccordion');

    if (typeof chrome !== 'undefined' && chrome.history) {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        chrome.history.search({
            text: '',
            startTime: yesterday.getTime(),
            maxResults: 50
        }, (historyItems) => {
            const groupedHistory = groupHistoryByDate(historyItems);
            renderHistoryAccordion(groupedHistory);
        });
    } else {
        // Mock history for demo
        const mockHistory = {
            'Hôm nay': [
                { title: 'Claude AI', url: 'https://claude.ai', visitTime: new Date().getTime() },
                { title: 'GitHub', url: 'https://github.com', visitTime: new Date().getTime() - 3600000 },
                { title: 'Stack Overflow', url: 'https://stackoverflow.com', visitTime: new Date().getTime() - 7200000 }
            ],
            'Hôm qua': [
                { title: 'YouTube', url: 'https://youtube.com', visitTime: new Date().getTime() - 86400000 },
                { title: 'Gmail', url: 'https://gmail.com', visitTime: new Date().getTime() - 90000000 }
            ]
        };
        renderHistoryAccordion(mockHistory);
    }
}

function groupHistoryByDate(historyItems) {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const groups = {
        'Hôm nay': [],
        'Hôm qua': []
    };

    historyItems.forEach(item => {
        const itemDate = new Date(item.lastVisitTime);
        if (itemDate.toDateString() === today.toDateString()) {
            groups['Hôm nay'].push(item);
        } else if (itemDate.toDateString() === yesterday.toDateString()) {
            groups['Hôm qua'].push(item);
        }
    });

    return groups;
}

function renderHistoryAccordion(groupedHistory) {
    const container = document.getElementById('historyAccordion');
    container.innerHTML = '';

    Object.entries(groupedHistory).forEach(([date, items]) => {
        if (items.length === 0) return;

        const accordionItem = document.createElement('div');
        accordionItem.className = 'accordion-item';

        const header = document.createElement('div');
        header.className = 'accordion-header';
        header.innerHTML = `
            <span>${date} (${items.length})</span>
            <span>▼</span>
        `;

        const content = document.createElement('div');
        content.className = 'accordion-content';

        items.forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';

            // Create favicon with improved fallback
            const favicon = document.createElement('img');
            favicon.className = 'history-favicon';
            applyFaviconWithFallbacks(favicon, item.url);

            const infoDiv = document.createElement('div');
            infoDiv.className = 'history-info';

            const titleDiv = document.createElement('div');
            titleDiv.className = 'history-title-text';
            titleDiv.textContent = item.title || 'Untitled';

            const urlDiv = document.createElement('div');
            urlDiv.className = 'history-url';
            urlDiv.textContent = item.url;

            const timeDiv = document.createElement('div');
            timeDiv.className = 'history-time';
            timeDiv.textContent = new Date(item.lastVisitTime || item.visitTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

            infoDiv.appendChild(titleDiv);
            infoDiv.appendChild(urlDiv);

            historyItem.appendChild(favicon);
            historyItem.appendChild(infoDiv);
            historyItem.appendChild(timeDiv);

            historyItem.addEventListener('click', () => {
                window.location.href = item.url;
            });
            content.appendChild(historyItem);
        });

        header.addEventListener('click', () => {
            const isActive = header.classList.contains('active');

            // Close all accordion items
            document.querySelectorAll('.accordion-header').forEach(h => h.classList.remove('active'));
            document.querySelectorAll('.accordion-content').forEach(c => c.classList.remove('active'));

            if (!isActive) {
                header.classList.add('active');
                content.classList.add('active');
            }
        });

        accordionItem.appendChild(header);
        accordionItem.appendChild(content);
        container.appendChild(accordionItem);
    });

    // Open first accordion by default
    const firstHeader = container.querySelector('.accordion-header');
    const firstContent = container.querySelector('.accordion-content');
    if (firstHeader && firstContent) {
        firstHeader.classList.add('active');
        firstContent.classList.add('active');
    }
}

// Custom select dropdown functionality
document.addEventListener('DOMContentLoaded', function() {
    const selectedOption = document.getElementById('selectedSearchEngine');
    const optionsContainer = document.getElementById('searchEngineOptions');
    const options = document.querySelectorAll('.option');
    let currentSearchEngine = 'google'; // Default search engine
    
    // Toggle dropdown
    selectedOption.addEventListener('click', function() {
        optionsContainer.classList.toggle('show');
    });
    
    // Close dropdown when clicking elsewhere
    document.addEventListener('click', function(e) {
        if (!selectedOption.contains(e.target) && !optionsContainer.contains(e.target)) {
            optionsContainer.classList.remove('show');
        }
    });
    
    // Handle option selection
    options.forEach(option => {
        option.addEventListener('click', function() {
            const value = this.getAttribute('data-value');
            const imgSrc = this.querySelector('img').src;
            const text = this.querySelector('span').textContent;
            
            // Update selected option display
            selectedOption.querySelector('img').src = imgSrc;
            selectedOption.querySelector('span').textContent = text;
            
            // Update current search engine
            currentSearchEngine = value;
            
            // Close dropdown
            optionsContainer.classList.remove('show');
        });
    });
    
    // Modify your existing search function to use the currentSearchEngine variable
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    
    function performSearch() {
        const query = searchInput.value.trim();
        if (query) {
            let searchUrl;
            switch (currentSearchEngine) {
                case 'google':
                    searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
                    break;
                case 'bing':
                    searchUrl = `https://www.bing.com/search?q=${encodeURIComponent(query)}`;
                    break;
                case 'duckduckgo':
                    searchUrl = `https://duckduckgo.com/?q=${encodeURIComponent(query)}`;
                    break;
                case 'yahoo':
                    searchUrl = `https://search.yahoo.com/search?p=${encodeURIComponent(query)}`;
                    break;
                default:
                    searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
            }
            window.location.href = searchUrl;
        }
    }
    
    // Add event listeners for search
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
});

// Settings Modal functionality
document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsModal = document.getElementById('settingsModal');
    const closeSettingsModal = document.getElementById('closeSettingsModal');
    const backgroundUrlInput = document.getElementById('backgroundUrlInput');
    const backgroundFileInput = document.getElementById('backgroundFileInput');
    const applyUrlBackground = document.getElementById('applyUrlBackground');
    const saveBackground = document.getElementById('saveBackground');
    const resetBackground = document.getElementById('resetBackground');
    const backgroundPreview = document.getElementById('backgroundPreview');
    const noBackgroundMessage = document.getElementById('noBackgroundMessage');
    const toggleHideDecorativeCircle = document.querySelector('.toggle-hide-decorative-circle');

    let currentBackgroundData = null;

    // Open settings modal
    settingsBtn.addEventListener('click', function() {
        settingsModal.style.display = 'block';
        loadSavedBackground();
    });

    // Close settings modal
    closeSettingsModal.addEventListener('click', function() {
        settingsModal.style.display = 'none';
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === settingsModal) {
            settingsModal.style.display = 'none';
        }
    });

    // Apply background from URL
    applyUrlBackground.addEventListener('click', function() {
        const url = backgroundUrlInput.value.trim();
        if (url) {
            // Check if URL is valid before setting
            const img = new Image();
            img.onload = function() {
                updateBackgroundPreview(url);
                currentBackgroundData = {
                    type: 'url',
                    value: url
                };
            };
            img.onerror = function() {
                alert('Invalid image URL. Please check the link and try again.');
            };
            img.src = url;
        } else {
            alert('Please enter an image URL');
        }
    });

    // Handle file upload
    backgroundFileInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const imageData = e.target.result;
                updateBackgroundPreview(imageData);
                currentBackgroundData = {
                    type: 'data',
                    value: imageData
                };
            };
            reader.readAsDataURL(file);
        }
    });

    // Save background to localStorage
    saveBackground.addEventListener('click', function() {
        if (currentBackgroundData) {
            localStorage.setItem('customBackground', JSON.stringify(currentBackgroundData));
            applyBackgroundToPage(currentBackgroundData);
        } else {
            alert('Please select or enter a background image first');
        }
    });

    // Reset to default background
    resetBackground.addEventListener('click', function() {
        // Remove from localStorage
        localStorage.removeItem('customBackground');
        
        // Also remove from chrome.storage
        chrome.storage.sync.remove(['customBackground'], function() {
            console.log('Custom background removed from storage');
            
            // Update UI
            document.body.style.backgroundImage = '';
            document.body.style.backgroundColor = '';
            backgroundPreview.style.display = 'none';
            backgroundPreview.src = '';
            noBackgroundMessage.style.display = 'block';
            backgroundUrlInput.value = '';
            backgroundFileInput.value = '';
            currentBackgroundData = null;
            toggleHideDecorativeCircle.checked = false;
            
            // Notify other tabs
            chrome.runtime.sendMessage({
                action: "settingsUpdated",
                setting: "background"
            });
        });
    });

    // Update the background preview
    function updateBackgroundPreview(src) {
        backgroundPreview.src = src;
        backgroundPreview.style.display = 'block';
        noBackgroundMessage.style.display = 'none';
    }

    // Load saved background from localStorage
    function loadSavedBackground() {
        const savedBackground = localStorage.getItem('customBackground');
        if (savedBackground) {
            try {
                currentBackgroundData = JSON.parse(savedBackground);
                updateBackgroundPreview(currentBackgroundData.value);
                if (currentBackgroundData.type === 'url') {
                    backgroundUrlInput.value = currentBackgroundData.value;
                }
            } catch (e) {
                console.error('Error loading saved background:', e);
            }
            toggleHideDecorativeCircle.checked = true;
        } else {
            backgroundPreview.style.display = 'none';
            noBackgroundMessage.style.display = 'block';
            toggleHideDecorativeCircle.checked = false;
        }
    }

    // Apply background to the page
    function applyBackgroundToPage(backgroundData) {
        if (backgroundData && backgroundData.value) {
            document.body.style.backgroundImage = `url(${backgroundData.value})`;
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundPosition = 'center';
            document.body.style.backgroundRepeat = 'no-repeat';
            document.body.style.backgroundAttachment = 'fixed';
            toggleHideDecorativeCircle.checked = true;
        }
    }

    // Initial load of saved background
    function initializeBackground() {
        const savedBackground = localStorage.getItem('customBackground');
        if (savedBackground) {
            try {
                const backgroundData = JSON.parse(savedBackground);
                applyBackgroundToPage(backgroundData);
                toggleHideDecorativeCircle.checked = true;
                return;
            } catch (e) {
                console.error('Error applying saved background:', e);
            }
        }
        toggleHideDecorativeCircle.checked = false;
    }

    // Initialize background when page loads
    initializeBackground();
});

// Settings functionality
function initializeSettings() {
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsModal = document.getElementById('settingsModal');
    const closeSettingsModal = document.getElementById('closeSettingsModal');
    
    if (!settingsBtn || !settingsModal || !closeSettingsModal) {
        console.warn('Some settings elements are missing');
        return;
    }
    
    // Open settings modal
    settingsBtn.addEventListener('click', function() {
        settingsModal.style.display = 'block';
        loadSettings();
    });
    
    // Close settings modal
    closeSettingsModal.addEventListener('click', function() {
        settingsModal.style.display = 'none';
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === settingsModal) {
            settingsModal.style.display = 'none';
        }
    });
    
    // Initialize background settings
    initializeBackgroundSettings();
}

function loadSettings() {
    // Load any saved settings from chrome.storage.sync
    chrome.storage.sync.get(['customBackground'], function(result) {
        // Handle background settings
        if (result.customBackground) {
            const backgroundPreview = document.getElementById('backgroundPreview');
            const noBackgroundMessage = document.getElementById('noBackgroundMessage');
            
            if (backgroundPreview && noBackgroundMessage) {
                backgroundPreview.src = result.customBackground;
                backgroundPreview.style.display = 'block';
                noBackgroundMessage.style.display = 'none';
                
                // Also apply to body
                document.body.style.backgroundImage = `url(${result.customBackground})`;
                document.body.style.backgroundSize = 'cover';
                document.body.style.backgroundPosition = 'center';
            }
        }
    });
}

function initializeBackgroundSettings() {
    const applyUrlButton = document.getElementById('applyUrlBackground');
    const backgroundUrlInput = document.getElementById('backgroundUrlInput');
    const backgroundFileInput = document.getElementById('backgroundFileInput');
    
    if (applyUrlButton && backgroundUrlInput) {
        applyUrlButton.addEventListener('click', function() {
            const url = backgroundUrlInput.value.trim();
            if (url) {
                saveBackgroundSettings(url);
            }
        });
    }
    
    if (backgroundFileInput) {
        backgroundFileInput.addEventListener('change', function() {
            if (backgroundFileInput.files.length > 0) {
                const file = backgroundFileInput.files[0];
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    const dataUrl = e.target.result;
                    saveBackgroundSettings(dataUrl);
                };
                
                reader.readAsDataURL(file);
            }
        });
    }
}

function saveBackgroundSettings(backgroundUrl) {
    // Save to chrome.storage
    chrome.storage.sync.set({ customBackground: backgroundUrl }, function() {
        // Update preview
        const backgroundPreview = document.getElementById('backgroundPreview');
        const noBackgroundMessage = document.getElementById('noBackgroundMessage');
        
        if (backgroundPreview && noBackgroundMessage) {
            backgroundPreview.src = backgroundUrl;
            backgroundPreview.style.display = 'block';
            noBackgroundMessage.style.display = 'none';
        }
        
        // Apply to body
        document.body.style.backgroundImage = `url(${backgroundUrl})`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
        
        // Notify any open tabs about the update
        chrome.runtime.sendMessage({
            action: "settingsUpdated",
            setting: "background"
        });
    });
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    // Update clock immediately and every minute
    updateClock();
    setInterval(updateClock, 60000);

    // Initialize calendar
    const calendar = new Calendar();

    // Calendar navigation
    document.getElementById('prevMonth').addEventListener('click', () => {
        calendar.previousMonth();
    });

    document.getElementById('nextMonth').addEventListener('click', () => {
        calendar.nextMonth();
    });

    // Search functionality
    document.getElementById('searchBtn').addEventListener('click', performSearch);
    document.getElementById('searchInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // Load bookmarks and history
    loadBookmarks();
    loadHistory();
});