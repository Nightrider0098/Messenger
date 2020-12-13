// const User = require('../DbConnection')
// const { userModel } = require('../DbConnection');
const { AuthenticateUser, UserSingleModel } = require('../DbConnection/version2')

var passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
    function (username, password, done) {
        AuthenticateUser(username, password).then((result) => {
            if (result.code === 401) {
                console.log('Sending Error for Wrong Credentials')
                return done(new Error('Wrong Username or password!!'));
            }
            else if (result.code === 200) {
                // this will invoke serializer
                // console.log('Passing the id of user', result)
                let user = { id: result.userId }
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
    // console.log('serializing the user for sessions')
    // this will invoke deserilixer
   
    done(null, user.id);

});

passport.deserializeUser(function (id, done) {
    // console.log("deserializing the user to add req.user")
    UserSingleModel.findOne({ userId: id }, function (err, user) {
        if (err) { console.log("encountered error while finding the user through userModel") }
        done(err, { ...user, id: user.userId });
    });
});

exports.passport = passport;    