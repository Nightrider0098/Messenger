// Schemas are compiled to Model, A model is a class with which we construct documents.
const { Schema } = require('mongoose');
const { mongoose } = require('./Connectors/mongoose');


const messageThreadSchema = require('./Schema/messageThreadSchema');
const messageThreadModel = mongoose.model('newTag', messageThreadSchema);

const startNewThread = (details) => new Promise((resolve, reject) => {
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
    newMessage.save((err) => {
        if (err) {
            console.log("Error in sending the message!", err)
            reject()
        }
        else {
            resolve()
        }
    })
})

const sendMessage = (details) => new Promise((resolve, reject) => {

    messageThreadModel.updateOne({ threadId: details.threadId }, {
        $push: {
            messageArray: {
                time: details.date || (new Date).toUTCString(),
                sender: details.sender,
                receiver: details.receiver,
                message: details.message
            }
        }
    }).then(resolve).catch(reject)

})

const deleteMessage = (details) => new Promise((resolve, reject) => {

    messageThreadModel.updateOne({ threadId: details.threadId }, {
        $set: {
            "messageArray.$[nonDeleted].deleted": true,
            "messageArray.$[nonDeleted].message": ""
        },
    }, {
        arrayFilters: [{
            "nonDeleted._id": {
                $eq: mongoose.Types.ObjectId(details.id)
            }
        }]
    }).then(resolve).catch(reject)

})

const readMessage = (details) => new Promise((resolve, reject) => {

    messageThreadModel.updateOne({ threadId: details.threadId }, {
        $set: {
            "messageArray.$[nonDeleted].seen": true
        },
    }, {
        arrayFilters: [{
            "nonDeleted._id": {
                $eq: mongoose.Types.ObjectId(details.messageId)
            }
        }]
    }).then(resolve).catch(reject)

})

const receivedMessage = (details) => new Promise((resolve, reject) => {

    messageThreadModel.updateOne({ threadId: details.threadId }, {
        $set: {
            "messageArray.$[nonDeleted].received": true
        },
    }, {
        arrayFilters: [{
            "nonDeleted._id": {
                $eq: mongoose.Types.ObjectId(details.id)
            }
        }]
    }).then(resolve).catch(reject)

})

const getMessage = (details) => new Promise((resolve, reject) => {
    messageThreadModel.findOne({ threadId: details.threadId }).then((result) => {
        resolve(result)
    }).catch((err) => { reject(err) })
})

const threadExist = (id) => new Promise((resovle, reject) => {

    messageThreadModel.findOne({ threadId: id }).then((result) => {
        if (result !== undefined && result !== {})
            resolve(true)
        else
            resolve(false)
    }).catch(reject)
}

)


exports.sendMessage = sendMessage;
exports.getMessage = getMessage;
exports.deleteMessage = deleteMessage;
exports.threadExist = threadExist;
exports.readMessage = readMessage;
exports.receivedMessage = receivedMessage;
exports.startNewThread = startNewThread;


const { userSchema } = require('./Schema/userSchema');
const userModel = mongoose.model('users', userSchema);
const crypto = require('crypto');


const validatePassword = (passPhrase) => new Promise((resolve, reject) => {
    console.log('hashing password')
    crypto.pbkdf2(passPhrase, 'salt', 100000, 64, 'sha512', (err, derivedKey) => {
        if (err) reject(err);
        resolve(derivedKey.toString('hex'))

    });
})


const verifyUser = (details) => new Promise((resolve, reject) => {
    console.log('validating the user!!')
    userModel.findOne({ username: details.username }).then((result) => {
        if (!result) {
            console.log("authenticatoin failed as no user found")
            return resolve({ code: 401 })
        }
        validatePassword(details.password).then((processed) => {
            console.log("verifying user resolved!!")
            if (processed === result.password) {
                console.log("Authentication passed")
                return resolve({ code: 200, id: result._id })
            }
            else {
                console.log("Wrong user name and password!!")
                resolve({ code: 401 })
            }
        }).catch(reject)
    })
})


exports.verifyUser = verifyUser;
exports.userModel = userModel;