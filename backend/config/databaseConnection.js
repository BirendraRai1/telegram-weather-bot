const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const { DB_PASSWORD, DB_USER,DB_NAME} = process.env;
const dbURL = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.dk5ax2e.mongodb.net/${DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`
const connectDB = async()=>{
  try {
    await mongoose.connect(dbURL);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
}  



module.exports = connectDB;