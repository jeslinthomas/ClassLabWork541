// Event listener for using geolocation 
document.getElementById('geoLocation').addEventListener('click', function() {
    resetInputs();
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            getSunriseSunsetInfo(position.coords.latitude, position.coords.longitude);
        }, function(error) {
            alert("Error in Geolocation: " + error.message);
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
});

// Event listener for selecting a predefined location
document.getElementById('presetLocations').addEventListener('change', function() {
    resetInputs('select');
    const coords = this.value.split(',');
    if (coords.length === 2) {
        getSunriseSunsetInfo(coords[0], coords[1]);
    }
});

// Event listener for the search location input
document.getElementById('searchLocation').addEventListener('input', function() {
    resetInputs('input'); // Reset other inputs
});

// Event listener for searching a location
document.getElementById('searchButton').addEventListener('click', function() {
    const location = document.getElementById('searchLocation').value;
    if (location) {
        fetch(`https://geocode.maps.co/search?q=${encodeURIComponent(location)}`)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    getSunriseSunsetInfo(data[0].lat, data[0].lon);
                } else {
                    alert("Location not found.");
                }
            })
            .catch(() => alert("Error fetching location data."));
    } else {
        alert("Please enter a location to search.");
    }
});

// Function to reset other input methods
function resetInputs(triggeredBy = '') {
    if (triggeredBy !== 'select') {
        document.getElementById('presetLocations').value = '';
    }
    if (triggeredBy !== 'input') {
        document.getElementById('searchLocation').value = '';
    }
}

// Function to fetch sunrise and sunset info
function getSunriseSunsetInfo(latitude, longitude) {
    // Fetch data for today
    fetchSunriseSunsetData(latitude, longitude, 'today')
        .then(dataToday => {
            // Fetch data for tomorrow
            fetchSunriseSunsetData(latitude, longitude, 'tomorrow')
                .then(dataTomorrow => {
                    updateDisplay(dataToday, dataTomorrow);
                })
                .catch(() => alert("Error fetching tomorrow's sunrise and sunset data."));
        })
        .catch(() => alert("Error fetching today's sunrise and sunset data."));
}

// Helper function to fetch sunrise and sunset data
function fetchSunriseSunsetData(latitude, longitude, date) {
    return fetch(`https://api.sunrisesunset.io/json?lat=${latitude}&lng=${longitude}&date=${date}`)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'OK') {
                return data.results;
            } else {
                throw new Error("API Error");
            }
        });
}

// Helper function to format UTC offset
function formatUTCOffset(offsetMinutes) {
    const hours = Math.floor(Math.abs(offsetMinutes) / 60);
    const minutes = Math.abs(offsetMinutes) % 60;
    const sign = offsetMinutes >= 0 ? '+' : '-';
    return `${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

function updateDisplay(dataToday, dataTomorrow) {
    const todayData = document.getElementById('todayData');
    const tomorrowData = document.getElementById('tomorrowData');
    
    todayData.innerHTML = `
        <strong>Today:</strong>
        <div>Sunrise: ${dataToday.sunrise}</div>
        <div>Sunset: ${dataToday.sunset}</div>
        <div>Dawn: ${dataToday.dawn}</div>
        <div>Dusk: ${dataToday.dusk}</div>
        <div>Day Length: ${dataToday.day_length}</div>
        <div>Solar Noon: ${dataToday.solar_noon}</div>
        <div>Timezone: ${dataToday.timezone} (UTC ${formatUTCOffset(dataToday.utc_offset)})</div>
    `;

    tomorrowData.innerHTML = `
        <strong>Tomorrow:</strong>
        <div>Sunrise: ${dataTomorrow.sunrise}</div>
        <div>Sunset: ${dataTomorrow.sunset}</div>
        <div>Dawn: ${dataTomorrow.dawn}</div>
        <div>Dusk: ${dataTomorrow.dusk}</div>
        <div>Day Length: ${dataTomorrow.day_length}</div>
        <div>Solar Noon: ${dataTomorrow.solar_noon}</div>
        <div>Timezone: ${dataTomorrow.timezone} (UTC ${formatUTCOffset(dataTomorrow.utc_offset)})</div>
    `;
}
