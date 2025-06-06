const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require("cors");
dotenv.config();
const connectDB = require('./config/databaseConnection');

const adminRouter = require('./routes/admin');

const app = express();
// Middleware
app.use(express.json());
app.use(bodyParser.json({}));
app.use(cors({
  origin: process.env.FRONTEND_URL 
}));
const PORT = process.env.PORT || 3000;

// Connect to database
connectDB();



// Admin routes
app.use('/admin', adminRouter);


app.listen(PORT,"0.0.0.0",() => {
  console.log(`Admin panel running on port ${PORT}`);
});