const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/userSchema');

const intializePassport = (passport) => {
    const opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = process.env.JWT_SECRET; 
    
    passport.use(
      new JwtStrategy(opts, async (jwt_payload, done) => {
        console.log("jwt payload", jwt_payload)
        try {
          const user = await User.findById(jwt_payload.id); 
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        } catch (error) {
          return done(error, false);
        }
      })
    );
}


module.exports = intializePassport;
