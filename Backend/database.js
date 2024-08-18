const mongoose = require('mongoose');
connect().catch(err => console.log(err));

async function connect() {
    await mongoose.connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    console.log("Database connected");
}
