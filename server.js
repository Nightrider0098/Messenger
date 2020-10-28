var express = require('express');
var app = express();
const router = require('./router')
const path = require("path");
const bodyparser = require('body-parser')
// app.use(express.static(path.join(__dirname, "\\Public\\")));
const port = process.env.PORT || 4000;

app.use(bodyparser.urlencoded({ extended: false }))
app.use(bodyparser.json())

app.get("/conversation/:id", (req, res, done) => {
	let id = req.params.id
})

app.use("/api", router);

app.listen(port, () => {
	console.log(`listining on port ${port}`);
});
