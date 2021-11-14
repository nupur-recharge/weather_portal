import axios from 'axios';

const ApiPaths = {
 WEATHER_URL : (queryParams) => `https://api.openweathermap.org/data/2.5/onecall?lat=${queryParams.lat}&lon=${queryParams.lon}&units=metric&appid=a26c08e53ef12ab6b0b246020b9726e1`
}

const getWeather = (queryParams) => axios.get(ApiPaths.WEATHER_URL(queryParams))

export{
    getWeather 
}