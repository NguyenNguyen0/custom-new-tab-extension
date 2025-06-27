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

                        // Create favicon with fallback
                        const favicon = document.createElement('img');
                        favicon.className = 'bookmark-icon';
                        favicon.src = `chrome://favicon/${bookmark.url}`;
                        favicon.onerror = function () {
                            this.src = `https://www.google.com/s2/favicons?domain=${new URL(bookmark.url).hostname}&sz=32`;
                        };

                        bookmarkElement.appendChild(favicon);
                        bookmarkElement.appendChild(document.createTextNode(bookmark.title || 'Untitled'));

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
            favicon.src = `https://www.google.com/s2/favicons?domain=${bookmark.domain}&sz=32`;
            favicon.onerror = function () {
                this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiByeD0iNCIgZmlsbD0iIzMzNzNkYyIvPgo8cGF0aCBkPSJNOCA0VjEyTTQgOEgxMiIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPC9zdmc+';
            };

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

            // Create favicon with fallback
            const favicon = document.createElement('img');
            favicon.className = 'history-favicon';
            favicon.src = `https://www.google.com/s2/favicons?domain=${new URL(item.url).hostname}&sz=32`;
            favicon.onerror = function () {
                this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1zbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiByeD0iNCIgZmlsbD0iIzk5OTk5OSIvPgo8cGF0aCBkPSJNNSA2SDE0TTUgMTBIMTEiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPC9zdmc+';
            };

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

// Update search engine icon when selection changes
document.addEventListener('DOMContentLoaded', function() {
    const searchEngineSelector = document.getElementById('searchEngine');
    
    // Set initial icon class
    updateSearchEngineIcon();
    
    // Update when selection changes
    searchEngineSelector.addEventListener('change', updateSearchEngineIcon);
    
    function updateSearchEngineIcon() {
        // Remove all engine classes
        searchEngineSelector.classList.remove('google', 'bing', 'duckduckgo', 'yahoo');
        // Add the selected engine class
        searchEngineSelector.classList.add(searchEngineSelector.value);
    }
});

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