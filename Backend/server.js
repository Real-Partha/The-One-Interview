const express = require('express');
const bodyParser = require('body-parser');
const user = require('./models/user');
const connectDB = require('./database');


//load .env file
require('dotenv').config();

const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());

const authRoutes = require('./authentication');
const homeRoutes = require('./home');
const port = process.env.PORT || 3000;


//body parser middleware
app.use(bodyParser.json());

//routes middleware
app.use("/auth", authRoutes);
app.use("/home", homeRoutes);

connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}).catch(error => {
    console.error('Database connection failed:', error);
});