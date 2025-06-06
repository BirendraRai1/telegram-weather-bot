const mongoose = require('mongoose');
const Setting = require('../models/setting'); // Added this import
const dotenv = require("dotenv");
dotenv.config();
const { DB_PASSWORD, DB_USER, DB_NAME } = process.env;
const dbURL = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.dk5ax2e.mongodb.net/${DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`;
const { getWeather } = require('../services/weatherService');

// Mock axios at the top level
jest.mock('axios');

beforeAll(async () => {
  await mongoose.connect(dbURL);
  // Clear settings before all tests
  await Setting.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Weather Service', () => {
  it('should throw error when API key not set', async () => {
    // Ensure no API key exists
    await Setting.deleteMany({ key: 'OPENWEATHER_API_KEY' });
    
    await expect(getWeather('London')).rejects.toThrow('Weather API key not configured');
  });

  it('should fetch weather data with valid API key', async () => {
    // Set test API key
    await Setting.create({
      key: 'OPENWEATHER_API_KEY',
      value: 'valid_api_key'
    });
    
    // Get the mocked axios instance
    const axios = require('axios');
    
    // Mock the API response
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

    // Verify Axios was called with correct parameters
    expect(axios.get).toHaveBeenCalledWith(
      'https://api.openweathermap.org/data/2.5/weather?q=London&appid=valid_api_key&units=metric'
    );
  });
});