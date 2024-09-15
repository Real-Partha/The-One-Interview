//modules
const connectDB = require('./utils/database');
const cors = require('cors');
const bodyParser = require('body-parser');
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const cookieParser = require('cookie-parser');
const adminRoutes = require('./routes/adminRoutes');
const os = require('os');
const fs = require('fs').promises;
const path = require('path');

const communityRoutes = require('./routes/communityRoutes');

const app = express();
const port = process.env.PORT || 3000;

//load .env file
require('dotenv').config();


//set cors policy
app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
}));

app.use(bodyParser.json({ limit: '5mb' }));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));

function getFormattedDateTime() {
    const now = new Date();
    const date = now.toLocaleDateString('en-GB'); // Format: DD/MM/YYYY
    const time = now.toLocaleTimeString('en-GB'); // Format: HH:MM:SS
    return `${date} ${time}`;
}

app.use((req, res, next) => {
    const startTime = new Date();
    let url = req.url;
    res.on('finish', () => {
        const elapsedTime = new Date() - startTime;
        console.log(`[${getFormattedDateTime()}] ${req.method} ${url} - ${res.statusCode} (${elapsedTime}ms)`);
    });
    next();
});


//import passport strategies
require('./utils/passport');


//routes
const authRoutes = require('./routes/authentication');
const questionRoutes = require('./routes/questions');
const userRoutes = require('./routes/user');
const {router:accountRoutes} = require('./routes/account');
const commentsRouter = require('./routes/comments');
const companyRoutes = require('./routes/company');
const faqRoutes = require('./routes/faq');
const feedbackRoutes = require('./routes/feedback');
const tagRoutes = require('./routes/tags');


connectDB().then(() => {
    app.listen(port, '0.0.0.0',() => {
        console.log(`Server is running on http://0.0.0.0:${port}`);
    });
}).catch(error => {
    console.error('Database connection failed:', error);
});

const store = new MongoDBStore({
    uri: process.env.DATABASE_URL,
    collection: 'sessions'
  });

// mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true });
app.use(cookieParser(process.env.SESSION_SECRET))
// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'production',
      signed: true,
    }
  }));
app.use(passport.initialize());
app.use(passport.session());

// Middleware to check if session is restored
app.use((req, res, next) => {
    if (req.session.passport && req.session.passport.user) {
      req.session.sessionRestored = true;
    }
    next();
  });


  app.get('/', async (req, res) => {
    const healthCheck = {
        uptime: Math.floor(process.uptime()),
        message: 'OK',
        timestamp: new Date().toISOString(),
        nodeVersion: process.version,
        memoryUsage: process.memoryUsage(),
        cpuUsage: process.cpuUsage(),
        hostname: os.hostname(),
        platform: process.platform,
        numberOfCpus: os.cpus().length,
        totalMemory: (os.totalmem() / (1024 * 1024 * 1024)).toFixed(2),
        freeMemory: (os.freemem() / (1024 * 1024 * 1024)).toFixed(2)
    };

    try {
        const templatePath = path.join(__dirname, 'templates', 'health-check.html');
        let htmlContent = await fs.readFile(templatePath, 'utf-8');

        // Replace placeholders in the template
        htmlContent = htmlContent.replace('{{statusClass}}', healthCheck.message === 'OK' ? 'ok' : 'error');
        htmlContent = htmlContent.replace('{{message}}', healthCheck.message);
        htmlContent = htmlContent.replace('{{uptime}}', healthCheck.uptime);
        htmlContent = htmlContent.replace('{{timestamp}}', healthCheck.timestamp);
        htmlContent = htmlContent.replace('{{nodeVersion}}', healthCheck.nodeVersion);
        htmlContent = htmlContent.replace('{{hostname}}', healthCheck.hostname);
        htmlContent = htmlContent.replace('{{platform}}', healthCheck.platform);
        htmlContent = htmlContent.replace('{{numberOfCpus}}', healthCheck.numberOfCpus);
        htmlContent = htmlContent.replace('{{totalMemory}}', healthCheck.totalMemory);
        htmlContent = htmlContent.replace('{{freeMemory}}', healthCheck.freeMemory);

        res.status(200).send(htmlContent);
    } catch (error) {
        healthCheck.message = error.message;
        res.status(503).json(healthCheck);
    }
});

app.use('/comment', (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ error: 'Unauthorized' });
  });
  
  app.use('/comment', commentsRouter);

//routes middleware
app.use("/auth", authRoutes);
app.use("/", questionRoutes);
app.use("/user", userRoutes);
app.use("/account", accountRoutes);
app.use('/admin', adminRoutes);
app.use('/companies', companyRoutes);
app.use('/faq', faqRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/tags', tagRoutes);
app.use('/communities', communityRoutes);
