/* 
  LOCATION SECTION - related to search and selection
*/
//pull json for cities from Miserlou's API
const endpoint = 'https://gist.githubusercontent.com/Miserlou/c5cd8364bf9b2420bb29/raw/2bf258763cdddd704f8ffd3ea9a3e81d25e2c6f6/cities.json';

const cities = [];
fetch(endpoint)
  .then(blob => blob.json())
  .then(data => cities.push(...data));

function findMatches(wordToMatch, cities) {
  return cities.filter(place => {
    // use regex to figure out if the city or state matches what was searched
    const regex = new RegExp(wordToMatch, 'gi');
    return place.city.match(regex) || place.state.match(regex)
  });
}

function displayMatches() {
  const matchArray = findMatches(this.value, cities);
  const html = matchArray.map(place => {
    const regex = new RegExp(this.value, 'gi');
    const cityName = place.city.replace(regex, `<span class="hl">${this.value}</span>`);
    const stateName = place.state.replace(regex, `<span class="hl">${this.value}</span>`);
    const fullLocation = place.city +', '+ place.state;
    // build the html for each search result
    return `
      <li>
        <button onclick="change_location(this)" value="${fullLocation}">
            <span class="name">${cityName}, ${stateName}</span>
        </button>
      </li>
    `;
  }).join('');
  suggestions.innerHTML = html;
}

const searchInput = document.querySelector('.search');
const suggestions = document.querySelector('.suggestions');

searchInput.addEventListener('change', displayMatches);
searchInput.addEventListener('keyup', displayMatches);

function change_location(objButton){
    let fullLocationName = objButton.value;
    document.getElementById("selectedLocation").innerHTML = fullLocationName;
    getWeather(fullLocationName);
}
/* END LOCATION SECTION */

/*
  WEATHER SECTION - functionality to retrieve data from weatherBitAPI and display results
*/
const weatherBitAPIkey = '725b6e0e639448a281a8cca57ee6f9ac';
const forecast = document.querySelector('.forecast');

function getWeather(location){
    var request = new XMLHttpRequest()

    // open the request to weatherbit API
    // hardcoded to limit results to 7, can be extended to 16(?)
    request.open('GET', 'https://api.weatherbit.io/v2.0/forecast/daily?city=' + location + '&days=7' +'&key=' + weatherBitAPIkey , true)

    request.onload = function() {
        // begin accessing JSON data here
        var data = JSON.parse(this.response)

        // Check if the request was successful(ish)
        if (request.status >= 200 && request.status < 400) {
            console.log(data);
            console.log(data.data[0].weather.description);
            // call function to build the display
            displayWeather(data);
        } else {
            console.log('error')
            // TODO- better error handling, send graceful error to user
        }
    }
    //Send request
    request.send()
}

function displayWeather(weatherData) {
    var weatherArray = weatherData.data;
    weatherArray.forEach(element => {
        console.log(element.weather.description + ' on ' + element.valid_date);
    });
    const forecastHtml = weatherArray.map(element => {
        const date = element.valid_date;
        const dayOfWeek = getDayName(date, "en-US");
        const weatherDesc = element.weather.description;
        // build the html for each day result
        return `
        <div class="card span_1_of_7">
            <h2>Date: ${dayOfWeek}</h2>
            <p style=>${date}</p>
            <img height="50" width="50" src="https://www.weatherbit.io/static/img/icons/${element.weather.icon}.png">
            <p><b>Temp:</b> ${element.low_temp} to ${element.max_temp}</p>
            <p><b>Condition:</b> ${weatherDesc}</p>
            <p><b>Wind:</b> ${element.wind_spd} ${element.wind_cdir}</p>
        </div>
        `;
    }).join('');
    forecast.innerHTML = forecastHtml;
}

function getDayName(dateStr, locale) {
    var date = new Date(dateStr.replace(/-/g, '\/')); // Convert from YYYY-MM-DD to YYYY/MM/DD cause JS dates are...
    return date.toLocaleDateString(locale, { weekday: 'long' });
}

/* END WEATHER SECTION */