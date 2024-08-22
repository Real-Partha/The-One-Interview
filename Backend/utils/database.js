const mongoose = require('mongoose');
async function connectDB() {
    try {
        await mongoose.connect(process.env.DATABASE_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Database connected");
    } catch (err) {
        console.log("Database connection failed:", err);
        throw err;
    }
}

module.exports = connectDB;
