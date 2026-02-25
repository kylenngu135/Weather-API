export function addWeatherButtonListener() {
    document.addEventListener('DOMContentLoaded', function() {
            const pubBtn = document.getElementById('weather');
            pubBtn.addEventListener('click', loadWeather);
            console.log("clicked")
    });
}

async function loadWeather() {
    // console.log("called");
    let location = document.getElementById('location').value;
    let startDate = document.getElementById('startdate').value;
    let endDate = document.getElementById('enddate').value;

    const params = new URLSearchParams({
        location: location,
        startDate: startDate,
        endDate: endDate
    });

    const url = `http://localhost:8080/api/weather?${params}`;

    console.log(url);

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const data = await response.json();

        console.log(data);

        if (data.error) {
            alert('ERROR')
        } else {
            alert('SUCCESS')
        }

    } catch (error) {
        alert('Failed to retrieve weather data: ' + error.message);
    }
};


