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

// function numberWithCommas(x) {
//   return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
// }

function displayMatches() {
  const matchArray = findMatches(this.value, cities);
  const html = matchArray.map(place => {
    const regex = new RegExp(this.value, 'gi');
    const cityName = place.city.replace(regex, `<span class="hl">${this.value}</span>`);
    const stateName = place.state.replace(regex, `<span class="hl">${this.value}</span>`);
    const fullLocation = place.city +', '+ place.state;
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
    // Get geo cords for location
    let trimmedLocationName = fullLocationName.substring(0, fullLocationName.indexOf(","));
    getWeather(fullLocationName);
    //getWeather(trimmedLocationName); // the MetaWeather API doesn't like state specifications so just sending city
}

const weatherBitAPIkey = '725b6e0e639448a281a8cca57ee6f9ac';

function getWeather(location){
    var request = new XMLHttpRequest()

    // open the request to weatherbit API
    request.open('GET', 'https://api.weatherbit.io/v2.0/forecast/daily?city=' + location + '&days=7' +'&key=' + weatherBitAPIkey , true)

    request.onload = function() {
        // begin accessing JSON data here
        var data = JSON.parse(this.response)

        if (request.status >= 200 && request.status < 400) {
            console.log(data);
            console.log(data.data[0].weather.description);
            // call function to build the display
            displayWeather(data);
        } else {
            console.log('error')
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
        const weatherDesc = element.weather.description;
        return `
        <div class="card span_1_of_7">
            <h2>Date: ${date}</h2>
            <p>Condition: ${weatherDesc}</p>
        </div>
        `;
    }).join('');
    forecast.innerHTML = forecastHtml;
}

const forecast = document.querySelector('.forecast');