const mongoose = require('mongoose');
const User = require('../models/User');
const { getWeather } = require('../services/weatherService');

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Weather Service', () => {
  it('should throw error when API key not set', async () => {
    await expect(getWeather('London')).rejects.toThrow('Weather API key not configured');
  });

  it('should fetch weather data with valid API key', async () => {
    // Set test API key
    await mongoose.connection.collection('settings').insertOne({
      key: 'OPENWEATHER_API_KEY',
      value: 'valid_api_key'
    });
    
    // Mock axios
    jest.mock('axios');
    const axios = require('axios');
    axios.get.mockResolvedValue({
      data: {
        main: { temp: 20 },
        weather: [{ description: 'clear sky' }],
        name: 'London',
        sys: { country: 'GB' }
      }
    });
    
    const weather = await getWeather('London');
    expect(weather).toEqual({
      temp: 20,
      description: 'clear sky',
      city: 'London',
      country: 'GB'
    });
  });
});