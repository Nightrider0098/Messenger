const { Schema, mongo } = require('mongoose');

const userSchema = new Schema({
    userId: { type: Schema.Types.String, unique: true },
    username: { type: Schema.Types.String, unique: true },
    password: { type: Schema.Types.String, unique: true },
    premium: { type: Schema.Types.Boolean, default: false }
})

exports.userSchema = userSchema;
