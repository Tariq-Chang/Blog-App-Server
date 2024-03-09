const express = require('express');
const passport = require('passport');
const authRoutes = require('./routes/authRoutes');
const blogRoutes = require('./routes/blogRoutes');
const userRoutes = require('./routes/userRoutes');
const path = require('path');
const cors = require('cors');
const intializePassport = require('./config/passport');
const profileRoutes = require('./routes/profileRoutes');

require('dotenv').config();


// passport 
intializePassport(passport);

// db connection
require('./config/db');

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(express.json());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/blogs',passport.authenticate('jwt', {session:false}), blogRoutes);
app.use('/api/v1/profile',passport.authenticate('jwt', {session:false}),profileRoutes)
app.use('/api/v1/users',passport.authenticate('jwt', {session:false}),userRoutes)
app.get('/api/v1',passport.authenticate('jwt', {session: false}), (req,res) => {
    res.send("Homepage");
})

app.get('/', (req, res) => {
    res.redirect('/api/v1')
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})