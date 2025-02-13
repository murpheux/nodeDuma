const Opossum = require('opossum');
const axios = require('axios');

const weatherURL = 'https://api.weather.com/current?city=London';

const fetchWeatherData = async () => {
  try {
    return await axios.get(weatherURL);
  } catch (error) {
    throw new Error(`Error fetching weather data: ${error.message}`);
  }
};

const circuitBreaker = new Opossum(fetchWeatherData, {
  // Adjusted failure threshold for external dependencies
  failureThreshold: 5,
  // Shortened timeout for quicker recovery attempts
  openTimeout: 2000,
  // Fallback function with temporary weather data
  fallback: () => {
    console.warn('Circuit breaker tripped! Using default weather data.');
    return { data: { currentTemp: 15, weather: 'Partly Cloudy' } };
  },
});

async function getProtectedWeather() {
  try {
    const response = await circuitBreaker.fire();
    return response.data;
  } catch (error) {
    console.error('An unrecoverable error occurred!', error);
    // Handle unexpected exceptions beyond the breaker's control
  }
}

(async () => {
  // Simulate multiple requests with potential failures
  for (let i = 0; i < 15; i++) {
    const weatherData = await getProtectedWeather();
    console.log(`Current weather in London:`, weatherData);
  }
})();