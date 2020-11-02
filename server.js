var express = require('express');
var app = express();
const router = require('./routes')
const path = require("path");
const bodyparser = require('body-parser')
const port = process.env.PORT || 4000;

const { passport } = require('./Passport/local')
app.use(bodyparser.urlencoded({ extended: false }))
app.use(bodyparser.json())
var session = require("express-session");
app.use(express.static("public"));
const { isAuthorized } = require('./helper')


// app.set('trust proxy', 1)
app.use(session({
	secret: "ThisIsTopSeceretSoYouShallNotTellAnyOne",
	resave: true,
	saveUninitialized: true
	// cookie: { secure: true }
}
));
app.use(passport.initialize());
app.use(passport.session());
var cors = require('cors')
app.use(cors())

app.use('/login', passport.authenticate('local', {
	successRedirect: '/api/message/',
	failureRedirect: '/login'
}));

app.use("/api", router);


if (process.env.NODE_ENV !== 'production') {
	app.use('/', (req, res) => {

	})
}

app.listen(port, () => {
	console.log(`listining on port ${port}`);
});
