
let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth();
let activeInputId = null;

function showDatePicker(inputId) {
    activeInputId = inputId;
    const input = document.getElementById(inputId);
    const rect = input.getBoundingClientRect();
    const popup = document.getElementById('date-picker-popup');
    popup.style.left = rect.left + 'px';
    popup.style.top = rect.bottom + 'px';
    popup.style.display = 'block';
    renderCalendar(currentYear, currentMonth);
}

function hideDatePicker() {
    document.getElementById('date-picker-popup').style.display = 'none';
}

function renderCalendar(year, month) {
    const monthYearStr = new Date(year, month).toLocaleString('default', { month: 'long', year: 'numeric' });
    document.getElementById('current-month').textContent = monthYearStr;

    const grid = document.getElementById('date-grid');
    grid.innerHTML = '<div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>';

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
        grid.insertAdjacentHTML('beforeend', '<div></div>');
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayEl = document.createElement('div');
        dayEl.textContent = day;
        dayEl.onclick = () => selectDate(year, month, day);
        grid.appendChild(dayEl);
    }
}

function selectDate(year, month, day) {
    const dateStr = String(month + 1).padStart(2, '0') + '/' + String(day).padStart(2, '0') + '/' + String(year).slice(-2);
    document.getElementById(activeInputId).value = dateStr;
    hideDatePicker();
}

function prevMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar(currentYear, currentMonth);
}

function nextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar(currentYear, currentMonth);
}

document.addEventListener('click', function(event) {
    const popup = document.getElementById('date-picker-popup');
    if (popup && !popup.contains(event.target) && !event.target.matches('.date-picker-button')) {
        hideDatePicker();
    }
});
