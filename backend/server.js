const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const {PORT,FRONTEND_URL} = process.env
const cors = require("cors");
dotenv.config();
const connectDB = require('./config/databaseConnection');

const adminRouter = require('./routes/admin');

const app = express();
// Middleware
app.use(express.json());
app.use(bodyParser.json({}));
//app.use(cors());
app.use(cors({
  origin: FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
// Connect to database
connectDB();



// Admin routes
app.use('/admin', adminRouter);


app.listen(PORT || 3000,"0.0.0.0",() => {
  console.log(`Admin panel running on port ${PORT}`);
});