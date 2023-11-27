// script.js

function getSunriseSunsetData(latitude, longitude) {
  const apiUrl = `https://api.sunrisesunset.io/json?lat=${latitude}&lng=${longitude}&date=today&formatted=0`;

  $.ajax({
    url: apiUrl,
    method: 'GET',
    success: function (data) {
      updateDashboard(data.results);
      // Fetch and update tomorrow's data after updating today's data
      fetchTomorrowData(latitude, longitude);
    },
    error: function (error) {
      handleApiError(error.responseJSON);
    },
  });
}

function fetchTomorrowData(latitude, longitude) {
  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);

  const tomorrowApiUrl = `https://api.sunrisesunset.io/json?lat=${latitude}&lng=${longitude}&date=${tomorrowDate.toISOString().split('T')[0]}&formatted=0`;

  $.ajax({
    url: tomorrowApiUrl,
    method: 'GET',
    success: function (data) {
      updateTomorrowData(data.results);
    },
    error: function (error) {
      handleApiError(error.responseJSON);
    },
  });
}

function updateDashboard(results) {
  $('#today-sunrise').text(results.sunrise);
  $('#today-sunset').text(results.sunset);
  $('#today-dawn').text(results.civil_twilight_begin);
  $('#today-dusk').text(results.civil_twilight_end);
  $('#today-day-length').text(results.day_length);
  $('#today-solar-noon').text(results.solar_noon);
  $('#timezone').text(results.timezone);
}

function updateTomorrowData(results) {
  $('#tomorrow-sunrise').text(results.sunrise);
  $('#tomorrow-sunset').text(results.sunset);
  $('#tomorrow-dawn').text(results.civil_twilight_begin);
  $('#tomorrow-dusk').text(results.civil_twilight_end);
  $('#tomorrow-day-length').text(results.day_length);
  $('#tomorrow-solar-noon').text(results.solar_noon);
}

function handleApiError(error) {
  $('#error-message').text(`Error: ${error.status} - ${error.message}`);
  $('#error-message').show();

  // Clear previous data
  $('.sun-info').text('');
}

$('#search-btn').on('click', function () {
  const locationName = $('#location-input').val();
  if (locationName.trim() !== '') {
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
    handleApiError({ status: 400, message: 'Please enter a location.' });
  }
});

$('#current-location-btn').on('click', function () {
  getCurrentLocation();
});

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

getCurrentLocation();
