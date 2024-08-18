const express = require('express');
const bodyParser = require('body-parser');
const app = express();
//load .env file
require('dotenv').config();
const authRoutes = require('./authentication');
const homeRoutes = require('./home');
const port = process.env.PORT || 3000;

//body parser middleware
app.use(bodyParser.json());

//routes middleware
app.use("/auth", authRoutes);
app.use("/home", homeRoutes);

app.listen(port, () => {
    console.log(`Server is running on  http://localhost:${port}`);
});