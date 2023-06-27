var userFormEl = document.querySelector('#search-city');
var nameInputEl = document.querySelector('#cityname');
var weatherContainerEl = document.querySelector('#weather-container');
var forcastContainerEl = document.querySelector('#fiveday-forcast');
var cityButtonsEl = document.querySelector('#city-buttons');

var formSubmitHandler = function (event) {
  event.preventDefault();

  var locationName = nameInputEl.value.trim();
  console.log(locationName);

  if (locationName) {
    getCoordinate(locationName);
    weatherContainerEl.textContent = '';
    forcastContainerEl.textContent = '';
    nameInputEl.value = '';
  } else {
    alert('Please enter a City or Location');
  }
};


var buttonClickHandler = function (event) {
  var language = event.target.getAttribute('data-language');

  if (language) {
    getCoordinate(language);
    weatherContainerEl.textContent = '';
    forcastContainerEl.textContent = '';
    nameInputEl.value = '';
  }
};
var loadCityButtons = function () 
{
  var cities = JSON.parse(localStorage.getItem("cities"));

  if(!cities)
  {
   return;
  }
  for(var i = 0; i < cities.length; i++)
  {
    addCityButton(cities[i]);
  }

}

var addCityButton = function (city) 
{
  var cityButton = document.createElement('button');
  cityButton.setAttribute('data-language', city);
  cityButton.classList.add('btn');
  cityButton.innerHTML = city;
  cityButtonsEl.append(cityButton);
}

//api


var getCoordinate = function (city) {
  var location = city.split(" ");
  var fullLocation = location.join("+");

  var coordinateAPI = 'https://api.openweathermap.org/geo/1.0/direct?q=' + fullLocation + '&appid=6e23fb5a9f75d211ea5466fc9703f4d1';
   
  fetch(coordinateAPI)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          if(data.length != 0)
          {
          var latitude = data[0].lat;
          var longitude = data[0].lon;
          weatherApi(latitude, longitude);
          }
          else{
            alert('Invalid Response, Please enter a City or Location');
          }
        });
      } else {
        alert('Error: ' + response.statusText);
      }
    })
    .catch(function (error) {
      alert('Unable to connect to Weather API');
    });
    
};




var weatherApi = function (latitude, longitude) {
  var weatherUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + latitude + '&lon='+longitude +'&units=imperial' +'&appid=6e23fb5a9f75d211ea5466fc9703f4d1';


  fetch(weatherUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          getWeather(data);
        });
      } else {
        alert('Error: ' + response.statusText);
      }
    })
    .catch(function (error) {
      alert('Unable to connect to Weather API');
    });
};

function printForcast(weatherForcast){
  var locationEl = document.createElement("h3");
  var dateEl = document.createElement("h3");
  locationEl.innerHTML = String(weatherForcast[0].location);
  dateEl.innerHTML = "Date: " +String(weatherForcast[0].date);
  weatherContainerEl.append(locationEl);
  weatherContainerEl.append(dateEl);

  var conditionLink = "https://openweathermap.org/img/wn/" + String(weatherForcast[0].icon) + "@2x.png";
  var conditionEl = document.createElement("img");
  conditionEl.setAttribute('src', conditionLink);
  weatherContainerEl.append(conditionEl);

  var temperatureEl = document.createElement("h3");
  temperatureEl.innerHTML = String(weatherForcast[0].temperature);
  var windEl = document.createElement("h3");
  windEl.innerHTML = String(weatherForcast[0].wind);
  var humidityEl = document.createElement("h3");
  humidityEl.innerHTML = String(weatherForcast[0].humidity);
  weatherContainerEl.append(temperatureEl, windEl, humidityEl);


for(var i = 1; i< weatherForcast.length; i++)
{
  var cardEL =document.createElement("card");
  var cardHeaderEL = document.createElement("card-header");
  var dateEl = document.createElement("h3");
  dateEl.innerHTML = "Date: " +String(weatherForcast[i].date);
  cardHeaderEL.append(dateEl);
  cardEL.append(cardHeaderEL);

  var cardBodyEl = document.createElement("card-body");
  var conditionLink = "https://openweathermap.org/img/wn/" + String(weatherForcast[i].icon) + "@2x.png";
  console.log(conditionLink);
  var conditionEl = document.createElement("img");
  conditionEl.setAttribute('src', conditionLink);
  cardBodyEl.append(conditionEl);

  var temperatureEl = document.createElement("h3");
  temperatureEl.innerHTML = String(weatherForcast[i].temperature);
  var windEl = document.createElement("h3");
  windEl.innerHTML = String(weatherForcast[i].wind);
  var humidityEl = document.createElement("h3");
  humidityEl.innerHTML = String(weatherForcast[i].humidity);
  cardBodyEl.append(temperatureEl, windEl, humidityEl);
  cardEL.append(cardBodyEl);
  forcastContainerEl.append(cardEL);
}

}

var saveCity = function(weatherForcast)
{

  var cities = JSON.parse(localStorage.getItem("cities"));

  if(!cities)
  {
    cities = [];
  }
  for(var i = 0; i < cities.length; i++)
  {
    if(weatherForcast[0].location == cities[i])
    {
     return;
    }
  }
  cities.push(weatherForcast[0].location);
  localStorage.setItem("cities", JSON.stringify(cities));
  addCityButton(weatherForcast[0].location);
}

var getWeather = function (data) {

  if (data.length === 0) {
    weatherContainerEl.textContent = 'Weather Data Not Found.';
    return;
  }
    console.log(data);

   
    var weatherForcast = [
      {
        location: data.city.name,
        date: data.list[0].dt_txt.split(" ")[0],
        icon: data.list[0].weather[0].icon,
        temperature: "Temp: "+data.list[0].main.temp + "°F",
        wind: "Wind: " + data.list[0].wind.speed + " MPH",
        humidity: "Humidity: "+data.list[0].main.humidity + "%"
      },
      {
        location: data.city.name,
        date: data.list[8].dt_txt.split(" ")[0],
        icon: data.list[8].weather[0].icon,
        temperature: "Temp: "+data.list[8].main.temp + "°F",
        wind: "Wind: " + data.list[8].wind.speed + " MPH",
        humidity: "Humidity: "+data.list[8].main.humidity + "%"
      },
      {
        location: data.city.name,
        date: data.list[16].dt_txt.split(" ")[0],
        icon: data.list[16].weather[0].icon,
        temperature: "Temp: "+data.list[16].main.temp + "°F",
        wind: "Wind: " + data.list[16].wind.speed + " MPH",
        humidity: "Humidity: "+data.list[16].main.humidity + "%"
      },
      {
        location: data.city.name,
        date: data.list[24].dt_txt.split(" ")[0],
        icon: data.list[24].weather[0].icon,
        temperature: "Temp: "+data.list[24].main.temp + "°F",
        wind: "Wind: " + data.list[24].wind.speed + " MPH",
        humidity: "Humidity: "+data.list[24].main.humidity + "%"
      },
      {
        location: data.city.name,
        date: data.list[32].dt_txt.split(" ")[0],
        icon: data.list[32].weather[0].icon,
        temperature: "Temp: "+data.list[32].main.temp + "°F",
        wind: "Wind: " + data.list[32].wind.speed + " MPH",
        humidity: "Humidity: "+data.list[32].main.humidity + "%"
      },
      {
        location: data.city.name,
        date: data.list[39].dt_txt.split(" ")[0],
        icon: data.list[39].weather[0].icon,
        temperature: "Temp: "+data.list[39].main.temp + "°F",
        wind: "Wind: " + data.list[39].wind.speed + " MPH",
        humidity: "Humidity: "+data.list[39].main.humidity + "%"
      }
    ]
    printForcast(weatherForcast);
    saveCity(weatherForcast);
};
loadCityButtons();
userFormEl.addEventListener('submit', formSubmitHandler);
cityButtonsEl.addEventListener('click', buttonClickHandler);
