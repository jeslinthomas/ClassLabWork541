document.addEventListener("DOMContentLoaded", function () {
  const sunriseSunsetApiUrl = "https://api.sunrise-sunset.io/json";
  const geocodeApiUrl = "https://geocode.maps.co/";

  const getLocationBtn = document.getElementById("getLocation");
  const searchLocationBtn = document.getElementById("searchLocation");
  const locationInput = document.getElementById("locationInput");

  getLocationBtn.addEventListener("click", getCurrentLocation);
  searchLocationBtn.addEventListener("click", searchLocation);

  function getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  function success(position) {
    const { latitude, longitude } = position.coords;
    getSunriseSunsetData(latitude, longitude);
  }

  function error() {
    alert("Unable to retrieve your location. Please try again or use the search option.");
  }

  function searchLocation() {
    const location = locationInput.value.trim();
    if (location === "") {
      alert("Please enter a location.");
      return;
    }

    getGeocodeData(location);
  }

  function getGeocodeData(location) {
    const geocodeApiParams = {
      address: location
    };

    const geocodeUrl = `${geocodeApiUrl}?${new URLSearchParams(geocodeApiParams)}`;

    fetch(geocodeUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data.results.length > 0) {
          const { lat, lon } = data.results[0].geometry;
          getSunriseSunsetData(lat, lon);
        } else {
          alert("Location not found. Please enter a valid location.");
        }
      })
      .catch((error) => {
        console.error("Error fetching geocode data:", error);
        alert("An error occurred while fetching location data. Please try again.");
      });
  }

  function getSunriseSunsetData(latitude, longitude) {
    const sunriseSunsetApiParams = {
      lat: latitude,
      lng: longitude,
      date: "today",
      formatted: 0
    };

    const sunriseSunsetUrl = `${sunriseSunsetApiUrl}?${new URLSearchParams(sunriseSunsetApiParams)}`;

    fetch(sunriseSunsetUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "OK") {
          updateDashboard(data.results);
        } else {
          alert(`Error: ${data.status}`);
        }
      })
      .catch((error) => {
        console.error("Error fetching sunrise sunset data:", error);
        alert("An error occurred while fetching sunrise sunset data. Please try again.");
      });
  }

  function updateDashboard(results) {
    // Update your dashboard HTML elements with the data from the API response
    const todaySunrise = results.sunrise;
    const todaySunset = results.sunset;
    const tomorrowSunrise = results.sunrise_tomorrow;
    const tomorrowSunset = results.sunset_tomorrow;

    // Update other elements as needed
  }
});
