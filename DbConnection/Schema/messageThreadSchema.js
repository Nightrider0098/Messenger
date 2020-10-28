const { mongoose } = require('../Connectors/mongoose');

// const Schema = 
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

module.export = { mongoose, messageThreadSchema };
