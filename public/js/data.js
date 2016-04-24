'use strict';

var get_data = document.getElementById('get_data');
var display = document.getElementById('display');

window.onload = function(){
  var request = new XMLHttpRequest();
  request.addEventListener('load', function(data){
    var city = data.currentTarget.responseText;
    getWeatherData(city, function(coords){
      getAirNowData(coords);
      generateMap(coords);
    });
  });
  request.open('GET', "/currentCity");
  request.send();
};

function updateDisplay(object){
  for (var prop in object){
    if(object.hasOwnProperty(prop)){
      var p = document.createElement('p');
      p.innerHTML = prop + ": " + object[prop];
      display.appendChild(p);
    }
  }
}

get_data.addEventListener("click", function(){
  var city = document.getElementById('city').value;
  getWeatherData(city, function(coords){
    getAirNowData(coords);
    generateMap(coords);
  });
});

function getWeatherData(city, callback){
  var request = new XMLHttpRequest();
  request.addEventListener('load', function(data){
    var weatherData = JSON.parse(data.target.responseText).list[0];

    updateDisplay( {
      humidity : weatherData.main.humidity + "%",
      tempC : Math.round((weatherData.main.temp - 273) * 10)/10 + " C",
      description : weatherData.weather[0].description,
      windSpeed : weatherData.wind.speed + " m/s",
      windDeg : Math.round(weatherData.wind.deg) + " degrees"
    });

    callback({
      lat : JSON.parse(data.target.responseText).city.coord.lat,
      lon : JSON.parse(data.target.responseText).city.coord.lon
    });

  });
  request.open('GET', "/api/openweather/" + city);
  request.send();
}

function getAirNowData(coords){
  var request = new XMLHttpRequest();
  request.addEventListener('load', function(data){
    console.log('data', data.currentTarget.responseText);
  });
  request.open('GET', "/api/airnow/" + coords.lon + "/" + coords.lat);
  request.send();
}

