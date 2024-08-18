const express = require('express');
const bodyParser = require('body-parser');
const app = express();
//load .env file
require('dotenv').config();
const authRoutes = require('./authentication');
const homeRoutes = require('./home');
const port = process.env.PORT || 3000;

function getFormattedDateTime() {
    const now = new Date();
    const date = now.toLocaleDateString('en-GB'); // Format: DD/MM/YYYY
    const time = now.toLocaleTimeString('en-GB'); // Format: HH:MM:SS
    return `${date} ${time}`;
}

// Custom middleware to log requests with formatted time, method, URL, and response code
app.use((req, res, next) => {
    const startTime = new Date();
    let url = req.url;
    res.on('finish', () => {
        const elapsedTime = new Date() - startTime;
        console.log(`[${getFormattedDateTime()}] ${req.method} ${url} - ${res.statusCode} (${elapsedTime}ms)`);
    });

    next();
});

//body parser middleware
app.use(bodyParser.json());

//routes middleware
app.use("/auth", authRoutes);
app.use("/home", homeRoutes);

app.listen(port, () => {
    console.log(`Server is running on  http://localhost:${port}`);
});