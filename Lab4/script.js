let weather={
  fetchweather: function(city){
    fetch("https://weatherdbi.herokuapp.com/data/weather/"+city)
    .then((response)=>{
      
      if (!response.ok) {
        document.querySelector(".error").innerText="Please check the city name for getting weather details...";
        alert("No weather found.");
        throw new Error("No weather found.");
      }
      
      return response.json();
      
    })
    .then((data)=>this.displayWeather(data)); 
   },

   displayWeather: function(data){
    if(data.code==0)
    {
      document.querySelector(".error").innerText="The specified locatin does not exist. Please check the city name.";
     // alert(data.message); 
      //throw new Error("No weather found.");
    }
    if(data.code==1)
    {
      document.querySelector(".error").innerText="Please do not enter any special characters while fetching weather details";
      //alert(data.message); 
      //throw new Error("No weather found.");
    }
    if(data.code==2)
    {
      document.querySelector(".error").innerText="Search by coordinates not available due to excessive use of this feature. Try after sometime";
     // alert(data.message); 
      //throw new Error("No weather found.");
    }
  
    const { region }=data;
    const { dayhour }=data.currentConditions;
    //const { temp }=data.currentConditions;s
    const { c }=data.currentConditions.temp;
    const { precip }=data.currentConditions;
    const { humidity }=data.currentConditions;
    //const { wind }=data.currentConditions;
    const { km }=data.currentConditions.wind;

    const { comment }=data.currentConditions;
    const { iconURL }=data.currentConditions;
    console.log(region,dayhour,c,precip,humidity,km,comment,iconURL);
    document.querySelector(".error").innerText="";
    document.querySelector(".city").innerText="Weather in "+ region + " at "+dayhour;
    document.querySelector(".icon").src=iconURL;
    document.querySelector(".temp").innerText=c+"°C";
    document.querySelector(".description").innerText=comment;
    document.querySelector(".humidity").innerText="Humidity: "+humidity;
    document.querySelector(".wind").innerText="Wind Speed: "+km+" km/h";
    document.querySelector(".weather").classList.remove("loading");

    for(i=0;i<7;i++)
    { 
      //document.querySelector("day" + (i) + "max").innerText = "Max: " + data.next_days[0].max_temp+ "°C";
      document.querySelector(".weather_forecast_day"+(i+1)).innerText=data.next_days[i].day; 
      document.querySelector(".description"+(i+1)).innerText=data.next_days[i].comment;  
      document.querySelector(".day"+(i+1)+"max").innerText="Max: "+data.next_days[i].max_temp.c;  
      document.querySelector(".day"+(i+1)+"min").innerText="Min: "+data.next_days[i].min_temp.c;  
      document.querySelector(".weather_forecast_icon"+(i+1)).src=data.next_days[i].iconURL;  

    }

    document.body.style.backgroundImage =
    "url('https://source.unsplash.com/1600x900/?" + region + "')";

   },

   search: function(){
    this.fetchweather(document.querySelector(".search-bar").value);
   } 
   
};

let geocode = {
  reverseGeocode: function (latitude, longitude) {
    var apikey = "80a0a5c1c1db477e8567458eda7327ee";

    var api_url = "https://api.opencagedata.com/geocode/v1/json";

    var request_url =
      api_url +
      "?" +
      "key=" +
      apikey +
      "&q=" +
      encodeURIComponent(latitude + "," + longitude) +
      "&pretty=1" +
      "&no_annotations=1";

    // see full list of required and optional parameters:
    // https://opencagedata.com/api#forward

    var request = new XMLHttpRequest();
    request.open("GET", request_url, true);

    request.onload = function () {
      // see full list of possible response codes:
      // https://opencagedata.com/api#codes

      if (request.status == 200) {
        // Success!
        var data = JSON.parse(request.responseText);
        weather.fetchweather(data.results[0].components.city);
        console.log(data.results[0].components.city)
      } else if (request.status <= 500) {
        // We reached our target server, but it returned an error

        console.log("unable to geocode! Response code: " + request.status);
        var data = JSON.parse(request.responseText);
        console.log("error msg: " + data.status.message);
      } else {
        console.log("server error");
      }
    };

    request.onerror = function () {
      // There was a connection error of some sort
      console.log("unable to connect to server");
    };

    request.send(); // make the request
  },
  getLocation: function() {
    function success (data) {
      geocode.reverseGeocode(data.coords.latitude, data.coords.longitude);
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, console.error);
    }
    else {
      weather.fetchWeather("Denver");
    }
  }
};

document.querySelector(".search button").addEventListener("click",function(){
  weather.search();
})

document.querySelector(".search-bar").addEventListener("keyup",function(event){
  if(event.key=="Enter")
  weather.search();
});

document.querySelector(".geolocation button").addEventListener("click", () =>{
    document.querySelector(".search-bar").value="";
    geocode.getLocation();
  
});



function onError(error){
  // if any error occur while getting user location then we'll show it in infoText
  //infoTxt.innerText = error.message;
  //infoTxt.classList.add("error");
  document.querySelector(".error").innerText="There was an error fetching user location from the device..."
  console.log(error.message);
}

weather.fetchweather("Kansas");
