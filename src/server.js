const express = require('express');

require('dotenv').config();
require('./config/db');
const app = express();

app.get('/', (req,res) => {
    res.send("Homepage");
})

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})