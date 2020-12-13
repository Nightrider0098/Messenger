const { Schema } = require('mongoose');
const mongoose = require('mongoose')


const User = new Schema({
    userId: { type: Schema.Types.String, required: true },
    status: {
        online: {
            type: Schema.Types.Boolean,
            default: false
        },
        lastOnline: {
            type: Schema.Types.Date,
            default: (new Date()).toISOString()
        }
    },
    credentials: {
        username: {
            type: Schema.Types.String,
            required: true
        },
        password: {
            type: Schema.Types.String,
            required: true
        },
    }, allMessageArray: [{
        threadId: {
            type: Schema.Types.String,
            required: true
        },
        messageArray:
            [{
                messageId: {
                    type: Schema.Types.String,
                    required: true
                },
                mine: {
                    type: Schema.Types.Boolean,
                    required: true,
                    default: true
                },
                time: { type: Schema.Types.Date },
                message: { type: Schema.Types.String },
                received:
                {
                    type: Schema.Types.Boolean,
                    default: false
                }, seen:
                {
                    type: Schema.Types.Boolean,
                    default: false
                },
                deleted:
                {
                    type: Schema.Types.Boolean,
                    default: false
                }

            }]
    }]
})


exports.User = User;