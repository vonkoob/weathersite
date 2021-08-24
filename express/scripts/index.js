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
  const html = matchArray.slice(0, 15).map(place => {
    const regex = new RegExp(this.value, 'gi');
    const cityName = place.city.replace(regex, `<span class="hl">${this.value}</span>`);
    const stateName = place.state.replace(regex, `<span class="hl">${this.value}</span>`);
    const fullLocation = place.city + ', ' + place.state;
    // build the html for each search result
    return `
      <li>
        <button onclick="change_location(this)" value="${fullLocation}">
            <span class="name">${cityName}, ${stateName}</span>
        </button>
      </li>
    `;
  }).join('');

  let finalHtml = html;

  console.log(matchArray.length);
  if (matchArray.length > 15) {
    const searchRefineTip = `
    <li>
      (Results limited to the top 15 results, please refine your search or select from the above list)
    </li>`;
    // Only add the above item if we are limiting the search results
    finalHtml = html + searchRefineTip;
  } else if (matchArray.length <= 0) {
    const emptySearchTip = `
    <li>
      There are no results for the search term(s) used. Please try again
    </li>
    `;
    // Show notification with search showing nothing
    finalHtml = emptySearchTip;
  }
  // suggestions.innerHTML = html;
  suggestions.innerHTML = finalHtml;
}

const searchInput = document.querySelector('.search');
const suggestions = document.querySelector('.suggestions');

searchInput.addEventListener('change', displayMatches);
searchInput.addEventListener('keyup', displayMatches);

function change_location(objButton) {
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
// const todaycast = document.querySelector('.todaycast'); // TODO - Split forecast between today and future

function getWeather(location) {
  var request = new XMLHttpRequest()

  let sanitizedLocation = location.replace(/'/g, ''); // Weatherbit didn't like the ' character
  console.log(sanitizedLocation);

  // open the request to weatherbit API
  // hardcoded to limit results to 7, can be extended to 16(?)
  // request.open('GET', 'https://api.weatherbit.io/v2.0/forecast/daily?city=' + location + '&days=7' + '&key=' + weatherBitAPIkey, true)
  request.open('GET', 'https://api.weatherbit.io/v2.0/forecast/daily?city=' + sanitizedLocation + '&days=7' + '&key=' + weatherBitAPIkey, true)

  // START DEBUG
  // const fullAPIendpoint = 'https://api.weatherbit.io/v2.0/forecast/daily?city=' + sanitizedLocation + '&days=7' + '&key=' + weatherBitAPIkey;
  // console.log(fullAPIendpoint);
  // END DEBUG

  request.onload = function () {
    if (request) {
      try {
        // begin accessing JSON data here
        var data = JSON.parse(this.response)

        // Check if the request was successful(ish)
        if (request.status >= 200 && request.status < 400) {
          // START DEBUG
          // console.log(data);
          // console.log(data.data[0].weather.description);
          // END DEBUG
          // call function to build the display
          displayWeather(data);
        } else {
          console.log('Error requesting data from WeatherBit');
          alert("Error requesting data from WeatherBit");
        }
      } catch (e) {
        // alert(e); // error in the above string/JSON response
        alert("Error loading weather forecast for " + location);
      }
    }
  }
  //Send request
  request.send()
}

function displayWeather(weatherData) {
  var weatherArray = weatherData.data;

  const forecastHtml = weatherArray.map(element => {
    const date = element.valid_date;
    const dayOfWeek = getDayName(date, "en-US");
    const weatherDesc = element.weather.description;
    const lowTempF = Math.round((element.low_temp * 9 / 5 + 32) * 10) / 10; // Convert to F and round
    const highTempF = Math.round((element.max_temp * 9 / 5 + 32) * 10) / 10; // Convert to F and round
    const windSpeed = Math.round(element.wind_spd * 100) / 100; //Round to 2 decimals
    // build the html for each day result
    return `
      <div class="card">
          <h2>Date: ${dayOfWeek}</h2>
          <p style=>${date}</p>
          <img height="50" width="50" src="https://www.weatherbit.io/static/img/icons/${element.weather.icon}.png" alt="${weatherDesc}">
          <p><b>Temp:</b> ${lowTempF}<span>&#176;</span> to ${highTempF}<span>&#176;</span> </p>
          <p><b>Condition:</b> ${weatherDesc}</p>
          <p><b>Wind:</b> ${windSpeed} ${element.wind_cdir}</p>
      </div>
      `;
  }).join('');
  forecast.innerHTML = forecastHtml;

  // TODO - SPLIT FORECAST INTO TODAY AND FUTURE
  // let todayHtml = "";
  // let forecastHtml = "";

  // for (let i = 0; i < weatherArray.length; i++) {
  //   const date = weatherArray[i].valid_date;
  //   const dayOfWeek = getDayName(date, "en-US");
  //   const weatherDesc = weatherArray[i].weather.description;
  //   const lowTempF = Math.round((weatherArray[i].low_temp * 9 / 5 + 32) * 10) / 10; // Convert to F and round
  //   const highTempF = Math.round((weatherArray[i].max_temp * 9 / 5 + 32) * 10) / 10; // Convert to F and round
  //   const windSpeed = Math.round(weatherArray[i].wind_spd * 100) / 100; //Round to 2 decimals
  //   const tempHtml = `
  //   <div class="card">
  //       <h2>Date: ${dayOfWeek}</h2>
  //       <p style=>${date}</p>
  //       <img height="50" width="50" src="https://www.weatherbit.io/static/img/icons/${weatherArray[i].weather.icon}.png" alt="${weatherDesc}">
  //       <p><b>Temp:</b> ${lowTempF}<span>&#176;</span> to ${highTempF}<span>&#176;</span> </p>
  //       <p><b>Condition:</b> ${weatherDesc}</p>
  //       <p><b>Wind:</b> ${windSpeed} ${weatherArray[i].wind_cdir}</p>
  //   </div>
  //   `;
  //   if (i == 0) {
  //     //First element in array is Today
  //     todayHtml += tempHtml;
  //   } else {
  //     forecastHtml += tempHtml;
  //   }
  // }
  // forecast.innerHTML = forecastHtml;
  // todaycast.innerHTML = todayHtml;
  // END TODO
}

function getDayName(dateStr, locale) {
  var date = new Date(dateStr.replace(/-/g, '\/')); // Convert from YYYY-MM-DD to YYYY/MM/DD cause JS dates are...
  return date.toLocaleDateString(locale, { weekday: 'long' });
}

/* END WEATHER SECTION */