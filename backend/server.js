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
  origin: 'http://localhost:5173' 
}));
const PORT = process.env.PORT || 3000;

// Connect to database
connectDB();



// Admin routes
app.use('/admin', adminRouter);


app.listen(PORT, () => {
  console.log(`Admin panel running on port ${PORT}`);
});