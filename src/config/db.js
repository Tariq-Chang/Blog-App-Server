const mongoose = require('mongoose');

async function dbConnection(){
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connection successfull");
    } catch (error) {
        console.log("Error connecting to DB")
    }
}

dbConnection();