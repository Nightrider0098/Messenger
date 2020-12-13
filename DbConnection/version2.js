const { User } = require('./Schema/SimpleThreadSchema')
const { v4 } = require('uuid')
const uuid = v4
const { mongoose } = require('./Connectors/mongoose')
const { connection, mongo } = require('mongoose')
UserSingleModel = mongoose.model('UserCompleteMessage', User)
// UserDetailsModel = mongoose.model("UserCompleteME")

const util = require('util')
const { send } = require('process')
const passport = require('passport')
const print = (a) => console.log(util.inspect(a, false, null, true /* enable colors */))

const createNewUser = async (username, password) => {
    let a = uuid();
    await UserSingleModel.insertMany({
        userId: a,
        status: {
            online: true
        },
        credentials: {
            username: username,
            password: password
        },
        allMessageArray: []
    })




    return a;
}

const userOnline = async (id) => {
    UserSingleModel.update({ userId: id }, {
        status: {
            online: true,
            lastOnline: (new Date()).toISOString()
        }
    }, (err, res) => {
        if (err) { console.log(err) }
    })
}


const userOffline = async (id) => {
    UserSingleModel.updateOne({ userId: id }, {

        status: {
            online: false,
            // lastOnline: (new Date()).toISOString()
        }

    }, (err, res) => {
        if (err) { console.log(err) }
    })
}
const createNewThread = async (senderId, receiverId) => {
    // let a = uuid();
    await UserSingleModel.updateOne({ userId: senderId }, {
        $addToSet: {
            "allMessageArray": {
                threadId: receiverId,
                messageArray:
                    []
            }
        }
    }
        , (err, result) => {
            if (err) {
                console.log(err);
                return -1;
            }

        })
    await UserSingleModel.updateOne({ userId: receiverId }, {
        $addToSet: {
            "allMessageArray": {
                threadId: senderId,
                messageArray:
                    []
            }
        }
    }
        , (err, result) => {
            if (err) {
                console.log(err);
                return -1;
            }

        })
}

let a = uuid()
let b = uuid()

const sendMessage = async (senderId, receiverId, message) => {
    await UserSingleModel.updateOne({ userId: senderId }, { $addToSet: { "allMessageArray.$[findThread].messageArray": { time: (new Date()).toISOString(), message: message } } },
        { arrayFilters: [{ 'findThread.threadId': receiverId }] },
        (err, result) => {
            if (err) { console.log(err) }
        })
    await UserSingleModel.updateOne({ userId: receiverId }, { $addToSet: { "allMessageArray.$[findThread].messageArray": { mine: false, time: (new Date()).toISOString(), message: message } } },
        { arrayFilters: [{ 'findThread.threadId': senderId }] },
        (err, result) => {
            if (err) { console.log(err) }
        })

}

const sendFirstMessage = async (senderId, receiverId, message) => {
    await UserSingleModel.updateOne({ userId: senderId }, { $addToSet: { "allMessageArray.$[findThread].messageArray": { messageId: a, time: (new Date()).toISOString(), message: message } } },
        { arrayFilters: [{ 'findThread.threadId': receiverId }] },
        (err, result) => {
            if (err) { console.log(err) }
        })
    await UserSingleModel.updateOne({ userId: receiverId }, { $addToSet: { "allMessageArray.$[findThread].messageArray": { messageId: a, mine: false, time: (new Date()).toISOString(), message: message } } },
        { arrayFilters: [{ 'findThread.threadId': senderId }] },
        (err, result) => {
            if (err) { console.log(err) }
        })

}

const findUser = async (id) => {
    // let exists
    let res = await UserSingleModel.findOne({ userId: id }).exec()

    if (res !== {}) {
        return true
        // return true
    }
    else {
        return false
    }
    // console.log(exists)
    // return exists


}

const findMessageThread = async (senderId, receiverId) => {
    let res = await UserSingleModel.findOne({ userId: senderId, allMessageArray: { $elemMatch: { threadId: receiverId } } }).exec()
    if (res !== {})
        return true
    else { return false }
}

const findAllThreads = async (senderId) => {
    let res = await UserSingleModel.findOne({ userId: senderId }).exec()
    // console.log(res)
    res = res.allMessageArray.map(e => e.threadId)
    console.log(res)
    if (res !== {})
        return res
    else { return [] }
}
const seenMessage = async (senderId, receiverId, indexOfMessage) => {
    await UserSingleModel.updateOne({ userId: senderId }, {
        $set: {
            "allMessageArray.$[matchThreadId].messageArray.$[matchMessageID].seen": true
        }
    }, { arrayFilters: [{ 'matchThreadId.threadId': receiverId }, { 'matchMessageID.messageId': a }] }, (err) => {
        if (err) { console.log(err) }
    })
    await UserSingleModel.updateOne({ userId: receiverId }, {
        $set: {
            "allMessageArray.$[matchThreadId].messageArray.$[matchMessageID].seen": true
        }
    }, { arrayFilters: [{ 'matchThreadId.threadId': senderId }, { 'matchMessageID.messageId': a }] }, (err) => {
        if (err) { console.log(err) }
    })
}

const receivedMessage = async (senderId, receiverId, indexOfMessage) => {
    await UserSingleModel.updateOne({ userId: senderId }, {
        $set: {
            "allMessageArray.$[matchThreadId].messageArray.$[matchMessageID].received": true
        }
    }, { arrayFilters: [{ 'matchThreadId.threadId': receiverId }, { 'matchMessageID.messageId': a }] }, (err) => {
        if (err) { console.log(err) }
    })
    await UserSingleModel.updateOne({ userId: receiverId }, {
        $set: {
            "allMessageArray.$[matchThreadId].messageArray.$[matchMessageID].received": true
        }
    }, { arrayFilters: [{ 'matchThreadId.threadId': senderId }, { 'matchMessageID.messageId': a }] }, (err) => {
        if (err) { console.log(err) }
    })
}

const deleteMessage = async (senderId, receiverId, indexOfMessage) => {
    await UserSingleModel.updateOne({ userId: senderId }, {
        $set: {
            "allMessageArray.$[matchThreadId].messageArray.$[matchMessageID].deleted": true,
            "allMessageArray.$[matchThreadId].messageArray.$[matchMessageID].message": ""
        }
    }, { arrayFilters: [{ 'matchThreadId.threadId': receiverId }, { 'matchMessageID.messageId': a }] }, (err) => {
        if (err) { console.log(err) }
    })
    await UserSingleModel.updateOne({ userId: receiverId }, {
        $set: {
            "allMessageArray.$[matchThreadId].messageArray.$[matchMessageID].deleted": true,
            "allMessageArray.$[matchThreadId].messageArray.$[matchMessageID].message": ""
        }
    }, { arrayFilters: [{ 'matchThreadId.threadId': senderId }, { 'matchMessageID.messageId': a }] }, (err) => {
        if (err) { console.log(err) }
    })
}

const validateUser = async (username, password) => {
    let res = await UserSingleModel.findOne({ credentials: { username: username, password: password } }).exec()
    if (res === {})
        return false
    else {
        return res.userId
    }

}

const AuthenticateUser = async (username, password) => {
    console.log(username, password,"i am lising here")  
    let res = await UserSingleModel.findOne({ credentials: { username: username, password: password } }).exec()
    if (res === {})
        return { code: 401 }
    else {
        console.log(res)
        return { code: 200, userId: res.userId }
    }

}

const getAllmessage = async (senderId, receiverId) => {
    let found = await findMessageThread(senderId, receiverId)

    if (found) {
        console.log("message thread found ")
        let result = await UserSingleModel.find({ userId: senderId }, { allMessageArray: { $elemMatch: { threadId: receiverId } } }).exec()
        return result

    }
    else {
        console.log('message Thread not found')
        return ({})
    }
}



// threadId = senderId + receiverId;
// createNewUser()
// UserSingleModel.deleteMany({}, (err) => {
//     if (err) { console.log(err) }
// })
// createNewThread(senderId, receiverId).then(console.log)



exports.createNewUser = createNewUser;
exports.createNewThread = createNewThread;
exports.userOnline = userOnline
exports.userOffline = userOffline
exports.validateUser = validateUser
exports.getAllmessage = getAllmessage

exports.findMessageThread = findMessageThread
exports.findUser = findUser
exports.findAllThreads = findAllThreads;

exports.sendFirstMessage = sendFirstMessage
exports.sendMessage = sendMessage


exports.deleteMessage = deleteMessage
exports.receivedMessage = receivedMessage
exports.seenMessage = seenMessage

exports.print = print
exports.AuthenticateUser = AuthenticateUser
exports.UserSingleModel = UserSingleModel