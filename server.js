var express = require('express');
var app = express();
const router = require('./routes')
const path = require("path");
const bodyparser = require('body-parser')
const port = process.env.PORT || 4000;

const { passport } = require('./Passport/local')
app.use(bodyparser.urlencoded({ extended: false }))
// app.use(bodyparser.)
app.use(bodyparser.json())
var session = require("express-session");
app.use(express.static("public"));
// const { isAuthorized } = require('./helper')

const isPassportAuthorized = (req, res, next) => {
	if (req.user) {
		next()
	}
	else {
		res.status(401).send("unauthorized")
	}
}

// app.set('trust proxy', 1)
app.use(session({
	secret: "ThisIsTopSeceretSoYouShallNotTellAnyOne",
	resave: true,
	saveUninitialized: true,
	cookie: { secure: false }
}
));
app.use(passport.initialize());
app.use(passport.session());
var cors = require('cors');
const { isAuthorized } = require('./helper');
app.use(cors({ origin: 'localhost:3000', credentials: true }))

app.post('/login', passport.authenticate('local'), (req, res) => {
	console.log("request for authentication", req.body)
	res.json({ message: "authenticated" })
}
);

app.use("/api",isPassportAuthorized, router);


app.listen(port, () => {
	console.log(`listining on port ${port}`);
});
