const express = require('express');
const passport = require('passport');
const authRoutes = require('./routes/authRoutes')
const blogRoutes = require('./routes/blogRoutes');
const path = require('path');
const cors = require('cors');
const intializePassport = require('./config/passport');


require('dotenv').config();


// passport 
intializePassport(passport);

// db connection
require('./config/db');

const app = express();
app.use(cors());
app.use('/media', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/blogs',passport.authenticate('jwt', {session:false}), blogRoutes);
app.get('/api/v1',passport.authenticate('jwt', {session: false}), (req,res) => {
    res.send("Homepage");
})

app.get('/', (req, res) => {
    res.redirect('/api/v1')
})



const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})