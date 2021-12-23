var cityFormEl = document.querySelector("#city-form");
var citiesButtonsEl = document.querySelector("#language-buttons");
var cityInputEl = document.querySelector("#cityName");
var weatherContainerEl = document.querySelector("#weather-container");
var citySearchTerm = document.querySelector("#city-search-term");
var locationIconEl = document.querySelector(".weather-icon");
var weatherBoxEl = document.querySelector("#weather-box")


var formSubmitHandler = function(event) {
  // prevent page from refreshing
  event.preventDefault();

  // get value from input element
  var cityName = cityInputEl.value.trim();

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
          
          console.log(data);
          console.log("This is the weather id: " + data.id);
          console.log("This is the weather main temp: " + data.main.temp);
          console.log ("This is the FIRST icon value : " + data.weather[0].icon);
          displayForecast(data, city);
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch(function(error) {
      alert("Enter a valid city name");
    });
};

// var getFeaturedRepos = function(language) {
//   // format the github api url
//   var apiUrl = "https://api.github.com/search/repositories?q=" + language + "+is:featured&sort=help-wanted-issues";

//   // make a get request to url
//   fetch(apiUrl).then(function(response) {
//     // request was successful
//     if (response.ok) {
//       response.json().then(function(data) {
//         displayRepos(data.items, language);
//       });
//     } else {
//       alert("Error: " + response.statusText);
//     }
//   });
// };

var displayForecast = function(data, searchTerm) {
  console.log ("First Repos are not blank.  Repos length: " + data.length)
  // check if api returned any repos
  if (data.length === 0) {
    console.log ("repos are blank")
    weatherContainerEl.textContent = "No repositories found.";
    return;
  }
  console.log ("Repos are not blank.  Repos length: " + data.length)
  var todaysDate = moment().format('MM/DD/YYYY, h:mm a');
  var myWeatherIcon = data.weather[0].icon
  var weatherIconUrl = "http://openweathermap.org/img/w/" + myWeatherIcon +".png";
  console.log ("This should be the weather icon url: " + weatherIconUrl );
  locationIconEl.innerHTML = "<img src =" + weatherIconUrl +"></img>";
  
  // Display box around weather info
  document.getElementById("weather-box").className = ("col-12 col-md-8 weather-box");
   
  console.log ("This is the icon value : " + data.weather[0].icon);
  
  citySearchTerm.textContent = searchTerm + "  (" + todaysDate + ")";

  // loop over cities
  for (var i = 0; i < data.length; i++) {
    // format repo name
    var cityName = data[i].owner.login + "/" + data[i].name;

    // create a link for each repo
    var cityEl = document.createElement("a");
    cityEl.classList = "list-item flex-row justify-space-between align-center";
    cityEl.setAttribute("href", "./single-repo.html?repo=" + dataName);

    // create a span element to hold repository name
    var titleEl = document.createElement("span");
    titleEl.textContent = cityName;

    // append to container
    cityEl.appendChild(titleEl);

    // create a status element
    var statusEl = document.createElement("span");
    statusEl.classList = "flex-row align-center";

    // check if current repo has issues or not
    if (cities[i].open_issues_count > 0) {
      statusEl.innerHTML =
        "<i class='fas fa-times status-icon icon-danger'></i>" + cities[i].open_issues_count + " issue(s)";
    } else {
      statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
    }

    // append to container
    cityEl.appendChild(statusEl);

    // append container to the dom
    cityContainerEl.appendChild(cityEl);
  }
};

// add event listeners to form and button container
cityFormEl.addEventListener("submit", formSubmitHandler);
// citiesButtonsEl.addEventListener("click", buttonClickHandler);