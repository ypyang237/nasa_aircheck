'use strict';

var get_data = document.getElementById('get_data');
var display = document.getElementById('display');
var globalMap;

window.onload = function(){
  var request = new XMLHttpRequest();
  request.addEventListener('load', function(data){
    var city = data.currentTarget.responseText;
    console.log('LOAD');
    globalMap = L.map('mapid');

      L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'ypyang237.ponmj9ac',
        accessToken: 'pk.eyJ1IjoieXB5YW5nMjM3IiwiYSI6ImNpbmR3MXJxeDB4NmF2ZmtxYXgzMWFseGgifQ.N2EZUCHiW2pvHq9LHQZnXw'
      }).addTo(globalMap);


    getWeatherData(city, function(coords){
      getAirNowData(coords);
      generateMap(coords, globalMap);
    });
  });
  request.open('GET', "/search/currentCity");
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
  display.innerHTML = "";
  var city = document.getElementById('city').value;
  getWeatherData(city, function(coords){
    getAirNowData(coords);
    generateMap(coords, globalMap);
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
  });
  request.open('GET', "/api/airnow/" + coords.lon + "/" + coords.lat);
  request.send();
}

