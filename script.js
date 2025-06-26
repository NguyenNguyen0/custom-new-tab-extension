document.addEventListener("DOMContentLoaded", () => {
    const dateText = document.querySelector('.date-text');
    const hourText = document.querySelector('.hour');
    const minuteText = document.querySelector('.minute');
    
    // Update clock initially
    updateClock();
    
    // Update clock every second (for hour/minute values)
    setInterval(updateClock, 1000);
    
    // Initialize calendar
    initCalendar();
});

function updateClock() {
    const dateText = document.querySelector('.date-text');
    const hourText = document.querySelector('.hour');
    const minuteText = document.querySelector('.minute');
    const secondProgressbar = document.querySelector('.second-progressbar');

    const currentDate = new Date();
    
    // Format the date: Weekday, Day, Month
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    dateText.innerHTML = currentDate.toLocaleDateString('en-US', options);
    
    // Update time
    hourText.innerHTML = formatTime(currentDate.getHours());
    minuteText.innerHTML = formatTime(currentDate.getMinutes());
    secondProgressbar.style.width = `${parseInt(currentDate.getSeconds() / 60 * 100)}%`;
}

const formatTime = (time) => {
    return time >= 10 ? time : `0${time}`;
}

function initCalendar() {
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    
    const monthNavPrev = document.querySelector('.month-nav.prev');
    const monthNavNext = document.querySelector('.month-nav.next');
    const currentMonthYear = document.querySelector('.current-month-year');
    const daysContainer = document.querySelector('.days');
    
    // Add event listeners to navigation buttons
    monthNavPrev.addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar(currentMonth, currentYear);
    });
    
    monthNavNext.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar(currentMonth, currentYear);
    });
    
    // Initial render
    renderCalendar(currentMonth, currentYear);
    
    function renderCalendar(month, year) {
        // Update header text
        const monthNames = ["January", "February", "March", "April", "May", "June",
                          "July", "August", "September", "October", "November", "December"];
        currentMonthYear.textContent = `${monthNames[month]} ${year}`;
        
        // Clear previous days
        daysContainer.innerHTML = '';
        
        // Get first day of month and last day of month
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
        
        // Add empty slots for days before start of month
        for (let i = 0; i < firstDayOfMonth; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.classList.add('empty');
            daysContainer.appendChild(emptyDay);
        }
        
        // Add days of the month
        const today = new Date();
        for (let day = 1; day <= lastDayOfMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.textContent = day;
            
            // Check if this day is today
            if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                dayElement.classList.add('today');
            }
            
            // Add click event to select day
            dayElement.addEventListener('click', () => {
                // Remove selected class from all days
                document.querySelectorAll('.days div.selected').forEach(div => {
                    div.classList.remove('selected');
                });
                // Add selected class to clicked day
                dayElement.classList.add('selected');
            });
            
            daysContainer.appendChild(dayElement);
        }
    }
} 