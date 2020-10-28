let mongoose = require('mongoose');
mongoose.connect('mongodb+srv://Hitesh:MITohnasan@12345@dflow.asmti.mongodb.net/messenger?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => { console.log("connection established with mongodb server online"); })
    .catch(err => {
        console.log("error while connection", err)
    });

module.exports = {mongoose}