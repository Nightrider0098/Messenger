const { Schema } = require('mongoose');

const messageThreadSchema = new Schema({
     messageArray: [{
        id: Schema.Types.String,
        time: { type: Schema.Types.Date, default: Date.now },
        seen: { type: Schema.Types.Boolean, default: false },
        received: { type: Schema.Types.Boolean, default: false },
        message: Schema.Types.String,
        
    }]

})

module.exports = messageThreadSchema;
