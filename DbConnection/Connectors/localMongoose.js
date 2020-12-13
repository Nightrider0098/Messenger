let mongoose = require('mongoose');

var url = 'mongodb://localhost:27017/myproject';

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => { console.log("connection established with mongodb server online"); })
    .catch(err => {
        console.log("error while connection", err)
    });

module.exports = { mongoose }