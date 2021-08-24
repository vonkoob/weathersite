# Weathersite - Forecast App

## General Info
Simple project using Node.js, HTML, CSS, and Javascript to allow a user to search for a location (currently limited within the US), select, and view a 7-day weather forecast for the selected location.

## Setup
To run this project, install it locally using NPM:
* Install the required modules via `npm install`
* From the repository directory, run `npm start` to create the Node Express server
* Browse to 'localhost:3000' to view site

## API connection(s):
* [Weatherbit.io](https://www.weatherbit.io/api)
* Miserlou's cities.json - To retrieve the 1000 largest US Cities by Pop. [here](https://gist.github.com/Miserlou/c5cd8364bf9b2420bb29)

## Features
* Search for a location (within the US)
* Select a location
* View a 7-day weather forecast for the selected location

### TO-DO:
* Extend location search outside of the US
* Split the forecast data into Today and Future
    * Enhance the display to separate Today and Future forecast (Extend CSS Grid to whole page)
* Utilize .env to store environment variables and API key(s)