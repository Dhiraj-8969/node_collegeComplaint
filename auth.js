const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const User = require('./models/userSchema');

passport.use(new localStrategy(async(USERNAME, password, done) => {
    try {
        //console.log('Received credentials:', USERNAME, password);
        const user = await User.findOne({ CLG_RollNo: USERNAME });
        if (!user)
            return done(null, false, { message: 'Incorrect username.' });
        const isPasswoerdMatch = await user.comparePassword(password);
        if (isPasswoerdMatch) {
            return done(null, user);
        } else {
            return done(null, false, { message: 'Incorrect password.' })
        }
    } catch (err) {
        return done(err);
    }
}));
module.exports = passport;