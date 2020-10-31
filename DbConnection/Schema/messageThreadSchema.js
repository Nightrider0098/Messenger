const { Schema } = require('mongoose');

const messageThreadSchema = new Schema({
  threadId: { type: Schema.Types.String, unique: true },
  messageArray: [{
    time: { type: Schema.Types.Date, default: Date.now },
    sender: Schema.Types.String,
    receiver: Schema.Types.String,
    seen: { type: Schema.Types.Boolean, default: false },
    received: { type: Schema.Types.Boolean, default: false },
    deleted: { type: Schema.Types.Boolean, default: false },
    message: Schema.Types.String
  }]

})

module.exports = messageThreadSchema;
