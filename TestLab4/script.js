// script.js

// Function to get sunrise and sunset data using the sunrisesunset API
function getSunriseSunsetData(latitude, longitude) {
  const apiUrl = `https://api.sunrisesunset.io/json?lat=${latitude}&lng=${longitude}&date=today&formatted=0`;

  $.ajax({
    url: apiUrl,
    method: 'GET',
    success: function (data) {
      updateDashboard(data.results);
    },
    error: function (error) {
      handleApiError(error.responseJSON);
    },
  });
}

// Function to update the dashboard with sunrise and sunset data
function updateDashboard(results) {
  // Update HTML elements with data from the API response
  $('#today-sunrise').text(results.sunrise);
  $('#today-sunset').text(results.sunset);
  $('#today-dawn').text(results.civil_twilight_begin);
  $('#today-dusk').text(results.civil_twilight_end);
  $('#today-day-length').text(results.day_length);
  $('#today-solar-noon').text(results.solar_noon);
  $('#timezone').text(results.timezone);

  // Show tomorrow's data (similar to today)
  // ...

  // Remove any error messages
  $('#error-message').hide();
}

// Function to handle API errors and display an error message
function handleApiError(error) {
  $('#error-message').text(`Error: ${error.status} - ${error.message}`);
  $('#error-message').show();

  // Clear previous data
  $('.sun-info').text('');
}

// Function to get geolocation and update the dashboard
function getCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        getSunriseSunsetData(latitude, longitude);
      },
      function (error) {
        handleApiError({ status: error.code, message: error.message });
      }
    );
  } else {
    handleApiError({ status: 0, message: 'Geolocation is not supported by this browser.' });
  }
}

// Event listener for the "Search" button
$('#search-btn').on('click', function () {
  const locationName = $('#location-input').val();
  if (locationName.trim() !== '') {
    // Use the geocode API to get latitude and longitude
    const geocodeUrl = `https://geocode.maps.co/?address=${encodeURIComponent(locationName)}`;

    $.ajax({
      url: geocodeUrl,
      method: 'GET',
      success: function (data) {
        if (data.results.length > 0) {
          const latitude = data.results[0].geometry.location.lat;
          const longitude = data.results[0].geometry.location.lng;
          getSunriseSunsetData(latitude, longitude);
        } else {
          handleApiError({ status: 404, message: 'Location not found.' });
        }
      },
      error: function (error) {
        handleApiError(error.responseJSON);
      },
    });
  } else {
    // Empty input, show error
    handleApiError({ status: 400, message: 'Please enter a location.' });
  }
});

// Initialize the dashboard with current location data
getCurrentLocation();
