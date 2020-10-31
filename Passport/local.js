// const User = require('../DbConnection')
const { verifyUser } = require('../DbConnection')

var passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
    function (username, password, done) {
        console.log('reached some where here')
        verifyUser({ username: username, password: password }).then((result) => {
            if (result.code === 401) {
                return done(null, false, { message: 'Incorrect password or username.' });
            }
            if (result.code === 200) {
                return done(null, { id: result.id });
            }
        }).catch((err) => done(null, err))
    }
));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    // User.findById(id, function (err, user) {
    // done(err, user);
    // });
    done(null, {})
});

exports.passport = passport;