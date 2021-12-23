var cityFormEl = document.querySelector("#city-form");
var citiesButtonsEl = document.querySelector("#language-buttons");
var cityInputEl = document.querySelector("#cityName");
var weatherContainerEl = document.querySelector("#weather-container");
var citySearchTerm = document.querySelector("#city-search-term");
var locationIconEl = document.querySelector(".weather-icon");
var weatherBoxEl = document.querySelector("#weather-container");
var currentUvi = ""
var cityName = ""
var forecastContainerEl = document.querySelector("#forecast-container");


var formSubmitHandler = function(event) {
  // prevent page from refreshing
  event.preventDefault();

  // get value from input element
  cityName = cityInputEl.value.trim();

  if (cityName) {
    getWeather(cityName);

    // clear old content
    weatherContainerEl.textContent = "";
    cityInputEl.value = "";
    //*** RATHER THAN CLEAR ABOVE, THE CODE SHOULD SAVE TO LOCAL STORAGE, DISPLAY IN PREVIOUSLY SEARCHED buttons and THEN CLEARED.

  } else {
      alert("Please enter a City");
    }
};
// *** BELOW CODE WILL BE RE-PURPOSED FOR CLICKING FROM PREVIOUSLY SEARCHED CITIES TO CALL GETWEATHER.
// var buttonClickHandler = function(event) {
//   // get the language attribute from the clicked element
//   var language = event.target.getAttribute("data-language");

//   if (language) {
//     getFeaturedRepos(language);

//     // clear old content
//     repoContainerEl.textContent = "";
//   }
// };

var getWeather = function(city) {
  // format the weather api url
  console.log ("This is the city.  About to call API: " + city);
  var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=fb216df19d52385cbbcdf3f5081628c2" + "&units=imperial";

  // make a get request to url
  fetch(apiUrl)
    .then(function(response) {
      // request was successful
      if (response.ok) {
        console.log(response);
        response.json().then(function(data) {
          
          // console.log(data);
          // console.log("This is the weather id: " + data.id);
          // console.log("This is the weather main temp: " + data.main.temp);
          // console.log ("This is the FIRST icon value : " + data.weather[0].icon);

          var cityLat = data.coord.lat
          var cityLon = data.coord.lon
          var uvUrl = "https://api.openweathermap.org/data/2.5/onecall?lat="+ cityLat + "&lon=" + cityLon + 
          "&exclude=minutely,hourly,alerts&appid=fb216df19d52385cbbcdf3f5081628c2" + "&units=imperial";
          console.log ("about to fetch using this URL: " + uvUrl);
          getUvAndForecast(uvUrl, cityName);

          // displayWeather(data, city);
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch(function(error) {
      alert("Enter a valid city name");
    });
};
//  START OF CODE FOR 2ND FETCH
var getUvAndForecast = function(uvUrl, cityName) {
  // format the weather api url
  console.log ("Inside 2nd function.  About to call API: " + uvUrl);
    // make a get request to url
  fetch(uvUrl)
    .then(function(response) {
      // request was successful
      if (response.ok) {
        console.log(response);
        response.json().then(function(data) {
          
          console.log(data);
          console.log("This is the lat: " + data.lat);
          console.log("This is the uv index: " + data.current.uvi);
                   
          displayWeather(data, cityName);
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch(function(error) {
      alert("Something went wrong");
    });
};

// END OF 2nd FETCH

var displayWeather = function(data, cityName) {
  console.log ("Inside displayWeather function");
  // check if api returned any data
  if (data.lat === 0) {
    console.log ("Data is blank")
    weatherContainerEl.textContent = "No weather data found.";
    return;
  }
  var todaysDate = moment().format('MM/DD/YYYY');
  var myWeatherIcon = data.current.weather[0].icon
  var weatherIconUrl = "http://openweathermap.org/img/w/" + myWeatherIcon +".png";
  console.log ("This should be the weather icon url: " + weatherIconUrl );
  locationIconEl.innerHTML = "<img src =" + weatherIconUrl +"></img>";
  
  // Display box around weather info
  document.getElementById("weather-box").className = ("col-12 col-md-8 weather-box");
   
  console.log ("This is the icon value : " + data.current.weather[0].icon);
  console.log ("This is the city name about to be displayed: " + cityName);
  
  citySearchTerm.textContent = cityName + "  (" + todaysDate + ")";

  
  //Add data lines to weather-box
  var tempEl = document.createElement("p");
  tempEl.textContent = "Temp: " + data.current.temp + " F";
  var windEl = document.createElement("p");
  windEl.textContent = "Wind: " + data.current.wind_speed + " MPH";
  var humidityEl = document.createElement("p");
  humidityEl.textContent = "Humidity: " + data.current.humidity + " %";
  var uvEl = document.createElement("p");
  uvEl.textContent = "UV Index: " + data.current.uvi;  // Need to color code
  
  
  // Color code uvi
  if (data.current.uvi <= ".1"){
    console.log ("turn to green");
    var uvEl = document.createElement("a");
    uvEl.className = "green-background";
    uvEl.textContent = "UV Index: " + data.current.uvi;
    
  } else if (data.current.uvi <= ".5") {
      console.log ("turn to yellow");
      var uvEl = document.createElement("a");
      uvEl.className = "yellow-background";
      uvEl.textContent = "UV Index: " + data.current.uvi
    } else {
        console.log ("turn to red");
        var uvEl = document.createElement("a");
        uvEl.className = "red-background";
        uvEl.textContent = "UV Index: " + data.current.uvi
      };
  console.log ("Current uvi: " + uvEl.textContent);
    
  // append to container
  weatherBoxEl.appendChild(tempEl);
  weatherBoxEl.appendChild(windEl);
  weatherBoxEl.appendChild(humidityEl);
  weatherBoxEl.appendChild(uvEl);
  
  forecastContainerEl.textContent = "5 Day Forecast:"

};

// add event listeners to form and button container
cityFormEl.addEventListener("submit", formSubmitHandler);
// citiesButtonsEl.addEventListener("click", buttonClickHandler);