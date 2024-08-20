//modules
// const user = require('./models/user');
const connectDB = require('./database');
const cors = require('cors');
// const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3000;

//load .env file
require('dotenv').config();

require('./passport');

app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));
app.use(bodyParser.json()); 

//routes

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
const authRoutes = require('./authentication');
const homeRoutes = require('./home');



connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}).catch(error => {
    console.error('Database connection failed:', error);
});

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true });

// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.DATABASE_URL,
    }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));

app.use(passport.initialize());
app.use(passport.session());

//routes middleware
app.use("/auth", authRoutes);
app.use("/home", homeRoutes);