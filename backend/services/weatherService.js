const axios = require('axios');
const Setting = require('../models/setting');

const getWeather = async (city) => {
  const apiKeySetting = await Setting.findOne({ key: 'OPENWEATHER_API_KEY' });
  
  if (!apiKeySetting) {
    throw new Error('Weather API key not configured');
  }
  
  const response = await axios.get(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKeySetting.value}&units=metric`
  );

  
  return {
    temp: response.data.main.temp,
    description: response.data.weather[0].description,
    city: response.data.name,
    country: response.data.sys.country
  };
};

module.exports = { getWeather };