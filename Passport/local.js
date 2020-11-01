// const User = require('../DbConnection')
const { userModel, verifyUser } = require('../DbConnection')

var passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
    function (username, password, done) {
        verifyUser({ username: username, password: password }).then((result) => {
            if (result.code === 401) {
                console.log('Sending Error for Wrong Credentials')
                return done(new Error('Wrong Username or password!!'));
            }
            else if (result.code === 200) {
                // this will invoke serializer
                console.log('Passing the id of user')
                let user = { id: result.id }
                return done(null, user);
            }
            else {
                console.log('Unexpected Behavior', result)
                done(new Error("Internal Error"))
            }
        }).catch((err) => done(err))
    }
));

passport.serializeUser(function (user, done) {
    console.log('serializing the user for sessions')
    // this will invoke deserilixer
    done(null, user.id);

});

passport.deserializeUser(function (id, done) {
    console.log("deserializing the user to add req.user")
    userModel.findById(id, function (err, user) {
        console.log('looking at user details using find id===>', user)
        if (err) { console.log("encountered error while finding the user through userModel") }
        done(err, user);
    });
});

exports.passport = passport;    