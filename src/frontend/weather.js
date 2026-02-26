/*
const weatherCardTemplate = (day, formattedDate) => `
    <div class="weather-date">${formattedDate}</div>
    <div class="weather-info">
        <div class="info-row">
            <span class="info-label">Temperature</span>
            <span class="temp-large">${Math.round(day.temp)}°F</span>
        </div>
        <div class="info-row">
            <span class="info-label">High / Low</span>
            <span class="info-value">${Math.round(day.tempmax)}° / ${Math.round(day.tempmin)}°</span>
        </div>
        <div class="info-row">
            <span class="info-label">Humidity</span>
            <span class="info-value">${Math.round(day.humidity)}%</span>
        </div>
        <div class="info-row">
            <span class="info-label">Precipitation</span>
            <span class="info-value">${day.precip || 0}"</span>
        </div>
        <div class="info-row">
            <span class="info-label">Wind Speed</span>
            <span class="info-value">${Math.round(day.windspeed)} mph</span>
        </div>
        <div class="info-row">
            <span class="info-label">Cloud Cover</span>
            <span class="info-value">${Math.round(day.cloudcover)}%</span>
        </div>
        <div class="info-row">
            <span class="info-label">Sunrise</span>
            <span class="info-value">${formatTime(day.sunrise)}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Sunset</span>
            <span class="info-value">${formatTime(day.sunset)}</span>
        </div>
        ${day.conditions ? `<div class="conditions">${day.icon ? '🌤️ ' : ''}${day.conditions}</div>` : ''}
    </div>
`;

const form = document.getElementById('weatherForm');
const errorMessage = document.getElementById('errorMessage');
const loading = document.getElementById('loading');
const weatherResults = document.getElementById('weatherResults');
const locationHeader = document.getElementById('locationHeader');
const weatherGrid = document.getElementById('weatherGrid');
const submitBtn = document.getElementById('submitBtn');

// Helper function to format time (add this to your JS file)
function formatTime(timeString) {
    if (!timeString) return 'N/A';
    
    // timeString comes as "HH:MM:SS" from Visual Crossing
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    
    return `${displayHour}:${minutes} ${ampm}`;
}

export function addWeatherButtonListener() {
    document.addEventListener('DOMContentLoaded', function() {
            submitBtn.addEventListener('click', loadWeather);
    });
}

function displaySetup() {
    weatherResults.style.display = 'none';
    loading.style.display = 'block';
    submitBtn.disabled = true;
}

async function loadWeather() {
    // Hide previous results and errors
    hideError();
    displaySetup();

    // console.log("called");
    let location = document.getElementById('location').value;
    let startDate = document.getElementById('startDate').value;
    let endDate = document.getElementById('endDate').value;

    const params = new URLSearchParams({
        location: location,
        startDate: startDate,
        endDate: endDate
    });

    const url = `http://localhost:8080/api/weather?${params}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Invalid location or server error. Please try again.');
        }

        const data = await response.json();
        displayWeather(data);

        console.log(data);

    } catch (error) {
        alert('Failed to retrieve weather data: ' + error.message);
    } finally {
        loading.style.display = 'none';
        submitBtn.disabled = false;
    }
};

// Clear form on page load
window.addEventListener('load', () => {
    form.reset();
});

function displayWeather(data) {
    // Display location header
    locationHeader.innerHTML = `
        <h2>${data.resolvedAddress || data.address}</h2>
        <p>${data.days.length} day${data.days.length > 1 ? 's' : ''} of weather data</p>
    `;

    // Clear previous weather cards
    weatherGrid.innerHTML = '';

    // Create weather cards for each day
    data.days.forEach(day => {
        const card = createWeatherCard(day);
        weatherGrid.appendChild(card);
    });

    weatherResults.style.display = 'block';
}

function createWeatherCard(day) {
    const card = document.createElement('div');
    card.className = 'weather-card';

    const date = new Date(day.datetime);
    const formattedDate = date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });

    card.innerHTML = weatherCardTemplate(day, formattedDate);

    card.addEventListener('click', () => expandCard(card, day, formattedDate));

    return card;
}

function expandCard(cardElement, day, formattedDate) {
    // Clone the card
    const expandedCard = cardElement.cloneNode(true);
    expandedCard.classList.add('expanded');
    expandedCard.classList.remove('weather-card-clickable');

    // Create close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'close-btn';
    closeBtn.innerHTML = '×';
    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeModal();
    });

    // Add close button to card
    expandedCard.insertBefore(closeBtn, expandedCard.firstChild);

    // Clear modal and add expanded card
    modalOverlay.innerHTML = '';
    modalOverlay.appendChild(expandedCard);
    modalOverlay.classList.add('active');

    // Close modal when clicking overlay
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', handleEscapeKey);
}

function closeModal() {
    modalOverlay.classList.remove('active');
    document.removeEventListener('keydown', handleEscapeKey);
}

function handleEscapeKey(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

function hideError() {
    errorMessage.style.display = 'none';
}
*/

const form = document.getElementById('weatherForm');
const errorMessage = document.getElementById('errorMessage');
const loading = document.getElementById('loading');
const weatherResults = document.getElementById('weatherResults');
const locationHeader = document.getElementById('locationHeader');
const weatherGrid = document.getElementById('weatherGrid');
const submitBtn = document.getElementById('submitBtn');
const modalOverlay = document.getElementById('modalOverlay');

// Template constants
const weatherCardTemplate = (day, formattedDate) => `
    <div class="weather-date">${formattedDate}</div>
    <div class="weather-info">
        <div class="info-row">
            <span class="info-label">Temperature</span>
            <span class="temp-large">${Math.round(day.temp)}°F</span>
        </div>
        <div class="info-row">
            <span class="info-label">High / Low</span>
            <span class="info-value">${Math.round(day.tempmax)}° / ${Math.round(day.tempmin)}°</span>
        </div>
        <div class="info-row">
            <span class="info-label">Feels Like</span>
            <span class="info-value">${Math.round(day.feelslike)}°F</span>
        </div>
        <div class="info-row">
            <span class="info-label">Humidity</span>
            <span class="info-value">${Math.round(day.humidity)}%</span>
        </div>
        <div class="info-row">
            <span class="info-label">Precipitation</span>
            <span class="info-value">${day.precip || 0}"</span>
        </div>
        <div class="info-row">
            <span class="info-label">Wind Speed</span>
            <span class="info-value">${Math.round(day.windspeed)} mph</span>
        </div>
        ${day.conditions ? `<div class="conditions">${day.conditions}</div>` : ''}
    </div>
`;

const locationHeaderTemplate = (data) => `
    <h2>${data.resolvedAddress || data.address}</h2>
    <p>${data.days.length} day${data.days.length > 1 ? 's' : ''} of weather data</p>
`;

const dailySummaryTemplate = (day, formattedDate) => `
    <div class="weather-date">${formattedDate}</div>
    <div class="weather-info">
        <div class="info-row">
            <span class="info-label">Temperature</span>
            <span class="temp-large">${Math.round(day.temp)}°F</span>
        </div>
        <div class="info-row">
            <span class="info-label">High / Low</span>
            <span class="info-value">${Math.round(day.tempmax)}° / ${Math.round(day.tempmin)}°</span>
        </div>
        <div class="info-row">
            <span class="info-label">Feels Like</span>
            <span class="info-value">${Math.round(day.feelslike)}°F</span>
        </div>
        <div class="info-row">
            <span class="info-label">Humidity</span>
            <span class="info-value">${Math.round(day.humidity)}%</span>
        </div>
        <div class="info-row">
            <span class="info-label">Precipitation</span>
            <span class="info-value">${day.precip || 0}"</span>
        </div>
        <div class="info-row">
            <span class="info-label">Wind Speed</span>
            <span class="info-value">${Math.round(day.windspeed)} mph</span>
        </div>
        ${day.conditions ? `<div class="conditions">${day.conditions}</div>` : ''}
    </div>
`;

const hourlySectionTemplate = (hourlyCards) => `
    <div class="hourly-section">
        <h3 class="hourly-title">Hourly Forecast</h3>
        <div class="hourly-grid">
            ${hourlyCards}
        </div>
    </div>
`;

const hourCardTemplate = (hour, time) => `
    <div class="hour-card">
        <div class="hour-time">${time}</div>
        <div class="hour-temp">${Math.round(hour.temp)}°F</div>
        <div class="hour-details">
            <div class="hour-detail">
                <span class="hour-label">Humidity:</span>
                <span class="hour-value">${Math.round(hour.humidity)}%</span>
            </div>
            <div class="hour-detail">
                <span class="hour-label">Wind:</span>
                <span class="hour-value">${Math.round(hour.windspeed)} mph</span>
            </div>
            <div class="hour-detail">
                <span class="hour-label">Cloud:</span>
                <span class="hour-value">${Math.round(hour.cloudcover)}%</span>
            </div>
            ${hour.conditions ? `<div class="hour-conditions">${hour.conditions}</div>` : ''}
        </div>
    </div>
`;

export function addWeatherButtonListener() {
    document.addEventListener('DOMContentLoaded', function() {
            submitBtn.addEventListener('click', loadWeather);
    });
}


// Clear form on page load
window.addEventListener('load', () => {
    form.reset();
});

function displaySetup() {
    weatherResults.style.display = 'none';
    loading.style.display = 'block';
    submitBtn.disabled = true;
}

async function loadWeather() {
    // Hide previous results and errors
    hideError();
    displaySetup();

    // console.log("called");
    let location = document.getElementById('location').value;
    let startDate = document.getElementById('startDate').value;
    let endDate = document.getElementById('endDate').value;

    const params = new URLSearchParams({
        location: location,
        startDate: startDate,
        endDate: endDate
    });

    const url = `http://localhost:8080/api/weather?${params}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Invalid location or server error. Please try again.');
        }

        const data = await response.json();
        displayWeather(data);

        console.log(data);

    } catch (error) {
        alert('Failed to retrieve weather data: ' + error.message);
    } finally {
        loading.style.display = 'none';
        submitBtn.disabled = false;
    }
};

function displayWeather(data) {
    // Display location header using template
    locationHeader.innerHTML = locationHeaderTemplate(data);

    // Clear previous weather cards
    weatherGrid.innerHTML = '';

    // Create weather cards for each day
    data.days.forEach(day => {
        const card = createWeatherCard(day);
        weatherGrid.appendChild(card);
    });

    weatherResults.style.display = 'block';
}

function createWeatherCard(day) {
    const card = document.createElement('div');
    card.className = 'weather-card weather-card-clickable';

    const date = new Date(day.datetime);
    const formattedDate = date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });

    // Use template constant
    card.innerHTML = weatherCardTemplate(day, formattedDate);

    // Add click event to expand card
    card.addEventListener('click', () => expandCard(day, formattedDate));

    return card;
}

function expandCard(day, formattedDate) {
    // Create expanded card
    const expandedCard = document.createElement('div');
    expandedCard.className = 'weather-card expanded';

    // Create daily summary using template
    const dailySummary = dailySummaryTemplate(day, formattedDate);

    // Create hourly data section
    let hourlySection = '';
    if (day.hours && day.hours.length > 0) {
        const hourlyCards = day.hours.map(hour => createHourCard(hour)).join('');
        hourlySection = hourlySectionTemplate(hourlyCards);
    }

    expandedCard.innerHTML = dailySummary + hourlySection;

    // Create close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'close-btn';
    closeBtn.innerHTML = '×';
    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeModal();
    });

    // Add close button to card
    expandedCard.insertBefore(closeBtn, expandedCard.firstChild);

    // Clear modal and add expanded card
    modalOverlay.innerHTML = '';
    modalOverlay.appendChild(expandedCard);
    modalOverlay.classList.add('active');

    // Close modal when clicking overlay
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', handleEscapeKey);
}

function createHourCard(hour) {
    // Format time from "HH:MM:SS" to "H:MM AM/PM"
    const time = formatTime(hour.datetime);
    
    // Use template constant
    return hourCardTemplate(hour, time);
}

function formatTime(timeString) {
    if (!timeString) return 'N/A';
    
    // timeString comes as "HH:MM:SS" from Visual Crossing
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    
    return `${displayHour}:${minutes} ${ampm}`;
}

function closeModal() {
    modalOverlay.classList.remove('active');
    document.removeEventListener('keydown', handleEscapeKey);
}

function handleEscapeKey(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

function hideError() {
    errorMessage.style.display = 'none';
}
