// const { mongoose, messageThreadSchema } = require("./Schema/messageThreadSchema")
// Schemas are compiled to Model, A model is a class with which we construct documents.
const { mongoose } = require('./Connectors/mongoose');


const messageThreadSchema = new mongoose.Schema({
    // threadId: String
    threadId: { type: String, unique: true },
    messageArray: [{
        time: { type: Date, default: Date.now },
        sender: String,
        receiver: String,
        seen: { type: Boolean, default: false },
        received: { type: Boolean, default: false },
        deleted: { type: Boolean, default: false },
        message: String
    }]

})


const messageThreadModel = mongoose.model('newTag', messageThreadSchema);



const sendMessage = (details) => {
    console.log(details)
    let newMessage = new messageThreadModel({
        threadId: details.threadId,
        messageArray: [
            {
                time: details.date || (new Date).toUTCString(),
                sender: details.sender,
                receiver: details.receiver,
                message: details.message
            }
        ]
    })
    console.log(newMessage)
    newMessage.save((err) => {
        if (err) {
            console.log("Error in sending the message!", err)
            return false
        }
        else {

            return true
        }
    })
}



module.exports = { sendMessage };


