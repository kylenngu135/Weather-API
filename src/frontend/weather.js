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

const form = document.getElementById('weatherForm');
const errorMessage = document.getElementById('errorMessage');
const loading = document.getElementById('loading');
const weatherResults = document.getElementById('weatherResults');
const locationHeader = document.getElementById('locationHeader');
const weatherGrid = document.getElementById('weatherGrid');
const submitBtn = document.getElementById('submitBtn');

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

    return card;
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

function hideError() {
    errorMessage.style.display = 'none';
}
