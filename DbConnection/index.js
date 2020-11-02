// Schemas are compiled to Model, A model is a class with which we construct documents.
const { Schema, model } = require('mongoose');
const { mongoose } = require('./Connectors/mongoose');
const { v4 } = require('uuid');
const uuidv4 = v4;
const messageThreadSchema = require('./Schema/messageThreadSchema');
const messageThreadModel = mongoose.model('newtags', messageThreadSchema);
const updateMessageModel = mongoose.model('updatemessages', messageThreadSchema);

const startNewThread = (details) => new Promise(async (resolve, reject) => {
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
    let updateMessage = new updateMessageModel({
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
    console.log("saving message to mainMessage Database")
    await newMessage.save((err) => {
        if (err) {
            console.log("Error in sending the message!", err)
            reject()
        }
    })

    console.log('saving message to updateMessage Database')
    await updateMessage.save((err) => {
        if (err) {
            console.log("Error in sending the message!", err)
            reject()
        }

    })

    resolve()
})

const sendMessage = (details) => new Promise((resolve, reject) => {
    console.log('inserting document update collection')
    updateMessageModel.updateOne({ threadId: details.threadId }, {
        $push: {
            messageArray: {
                time: details.date || (new Date).toUTCString(),
                message: details.message
            }
        }
    }).then(async () => {
        console.log('Updating the main thread,', details)
        const value = await messageThreadModel.updateOne({ _id: mongoose.Types.ObjectId(details.threadId) }, {
            $push: {
                messageArray: {
                    time: details.date || (new Date).toUTCString(),
                    message: details.message
                }
            }
        });
        console.log("sucessfully updated main and update collection")
        return resolve(value);
    }).catch(() => { console.log("faced some issue"); reject() })

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

const readMessage = (threadId) => new Promise((resolve, reject) => {
    console.log("updating the read messages")
    messageThreadModel.updateOne({ _id: mongoose.Types.ObjectId(threadId) }, {
        $set: {
            "messageArray.$[nonDeleted].seen": true
        },
    }, {
        arrayFilters: [{
            "nonDeleted.seen": {
                $eq: false
            }
        }]
    }).then(resolve).catch(reject)

})

const receivedMessage = (details) => new Promise((resolve, reject) => {
    console.log('updating the received messages and clearing the updates from collection')
    messageThreadModel.updateOne({ _id: mongoose.Types.ObjectId(details.threadId) }, {
        $set: {
            "messageArray.$[nonDeleted].received": true
        },
    }, {
        arrayFilters: [{
            "nonDeleted.received": {
                $eq: false
            }
        }]
    }).then(() => {
        updateMessageModel.update({ threadId: details.threadId }, {
            messageArray: []
        }).then(resolve)
    }).catch(reject)


})

const updateAllMessage = async (threadId) => {
    await receivedMessage({ threadId: threadId }).then(() => {
        console.log('message received parameter updated')
    }).catch((err) => {
        console.log("encountered an error while updating the message in recieved section", err)

    })

}

const getMessage = (details) => new Promise((resolve, reject) => {
    console.log("Searching for conversation thread from database")
    messageThreadModel.findById(details.threadId).then((result) => {
        console.log("Found result")
        console.log('requesting to update that message are received')
        updateAllMessage(details.threadId)
        console.log("removing the updates from updateDatabase")
        updateMessageModel.deleteOne({ threadId: details.threadId }).then(() => {
            console.log("cleared the update collection")
        }).catch(() => {
            console.log('cant remove the update from the database')
        })

        console.log("sending the result of update")
        return resolve(result)

    }).catch((err) => {
        console.log("Failed to search into Database/", err)
        reject(err)
    })
})

const threadExist = (threadId) => new Promise((resolve, reject) => {
    console.log('searching for id in database')
    messageThreadModel.findById(threadId).then((result) => {
        if (result !== undefined && result !== {} && result !== null) {
            console.log("thread exists for the given id!!", result)
            resolve(true)
        }
        else {
            console.log('thread does not exists for the given id', id)
            resolve(false)
        }
    }).catch(reject)
}

)

const newConversation = (receiver) => new Promise((resolve, reject) => {

})



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

const convertPassword = (passPhrase) => new Promise((resolve, reject) => {
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
        convertPassword(details.password).then((processed) => {
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



const findUpdate = (threadId) => new Promise((resolve, reject) => {
    console.log("searching for update!!!")
    updateMessageModel.findOne({ threadId: threadId }).then((result) => {
        if (result === null || result === undefined || result.messageArray === undefined || (result.messageArray && result.messageArray.length === 0)) {
            console.log("no Update found for thread ", threadId, result)
            resolve({ update: false })
        }
        else {
            console.log("found updates")
            console.log("clearing the update collection and updating the received")
            updateAllMessage(threadId)
            return resolve({ update: true, message: result })
        }
        if (result === null) {
            updateMessageModel.insertMany([{
                threadId: threadId,
                messageArray: []
            }])
        }
    }).catch(reject)
})

exports.findUpdate = findUpdate;


const newUSerId = async () => {
    let id = uuidv4();

    await userModel.find({ userId: id }).then((res) => {
        if (res === []) {
            return id;
        }
        else {
            return uuidv4();
        }
    }).catch((e) => console.log('failed to create new id', e))
}

const newUser = (details) => new Promise((resolve, reject) => {
    console.log("createing new id")
    convertPassword(details.password).then((encPass) => {
        newUSerId().then((newId) => {
            let newUserDetails = new userModel({
                username: details.username,
                password: encPass,
                userId: newId,
                permium: false
            })
            newUserDetails.save().then(() => {
                console.log("new id created!!!")
                resolve(newId)
            }).catch((e) => {
                console.log("failed to register", e);
                reject()
            })
        })
    }).catch((err) => {
        console.log("error in making password,", err)
    })
})

exports.newUser = newUser