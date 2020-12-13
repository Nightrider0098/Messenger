const { Schema } = require('mongoose');
const mongoose = require('mongoose')
const mainMessageThreadSchema = new Schema({
    messageArray: [{
        time: { type: Schema.Types.Date, default: Date.now },
        seen: { type: Schema.Types.Boolean, default: false },
        received: { type: Schema.Types.Boolean, default: false },
        deleted: { type: Schema.Types.Boolean, default: false },
        message: Schema.Types.String
    }]

})


const UpdateMesaageThreadSchema = new Schema({
    mainThreadId: Schema.Types.String,
    messageArray: [{
        time: { type: Schema.Types.Date, default: Date.now },
        seen: { type: Schema.Types.Boolean, default: false },
        received: { type: Schema.Types.Boolean, default: false },
        deleted: { type: Schema.Types.Boolean, default: false },
        message: Schema.Types.String
    }]

})

const UserSocialLinksSchema = new Schema({
    username: Schema.Types.String,
    password: Schema.Types.String,
    fblink: { type: Schema.Types.String, default: "" },
    twlink: { type: Schema.Types.String, default: "" },
    wplink: { type: Schema.Types.String, default: "" },
    lnlink: { type: Schema.Types.String, default: "" }
})

const ThreadDetail = { updateThreadId: Schema.Types.String }

const UpdateHintsSchema = new Schema({
    userId: Schema.Types.String,
    updateCount: { type: Schema.Types.Boolean, default: false },
    updateThread: [ThreadDetail]
})


const receiverAndThread = {
    receiverId: Schema.Types.String,
    threadId: Schema.Types.String,
}

const threadMapping = new Schema({
    senderId: Schema.Types.String,
    threadList: [receiverAndThread]
})



exports.threadMapping = mongoose.model("threadmappings", threadMapping);
exports.UpdateHints = mongoose.model("updatehints", UpdateHintsSchema);
exports.UserSocialLinks = mongoose.model("usersociallinks", UserSocialLinksSchema);
exports.UpdateMesaageThread = mongoose.model("updatemessages", UpdateMesaageThreadSchema);
exports.mainMessageThread = mongoose.model('mainthreads', mainMessageThreadSchema);
