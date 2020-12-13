const router = require('express').Router()
const { response } = require('express')
const { route } = require('.')
const { pre } = require('../DbConnection/Schema/messageThreadSchema')
// const {print} = require()
const { findAllThreads, createNewUser, print, findUser, findMessageThread, deleteMessage, createNewThread, getAllmessage, receivedMessage, seenMessage, sendFirstMessage, sendMessage, userOffline, userOnline, validateUser } = require('../DbConnection/version2')


// direct functions
// createNewUSer


// inderect functions


// const sendMessage = async (credentails, messageHead) => {
//     if (await validateUser(credentails.username, credentails.password)) {
//         let threadId = await findMessageThread(messageHead.senderId, messageHead.receiverId))
//         if (threadId) {
//             await sendMessage(messageHead.senderId, messageHead.receiverId, "Hiii this is the rocket guy")
//         }
//         else {

//             newId = await createNewThread(messageHead.senderId, messageHead.receiverId)

//         }

//     }
// }

// }

var senderId = ''
var receiverId = ''

const dosometheing = async () => {
    await UserSingleModel.deleteMany({})


    // let foundSender = await findUser(senderId)
    // let foundReceiver = await findUser(receiverId)

    console.log('inserting dummy data')
    // if (!foundSender)
    let username = "Hitesh"
    let password = "123"
    senderId = await createNewUser(username, password)
    let user1 = await validateUser(username, password)
    // if (!foundReceiver)
    username = "Dinesh"
    password = "123"
    receiverId = await createNewUser(username, password)
    let user2 = await validateUser(username, password)

    username = "Prakash"
    password = "123"
    receiver2Id = await createNewUser(username, password)
    let user3 = await validateUser(username, password)

    username = "Prakash15"
    password = "123"
    receiver3Id = await createNewUser(username, password)
    let user4 = await validateUser(username, password)


    await createNewThread(senderId, receiverId)
    await findMessageThread(senderId, receiverId)

    await createNewThread(senderId, receiver2Id)
    await createNewThread(receiver3Id, senderId)

    await createNewThread(receiver2Id, receiverId)


    await sendFirstMessage(senderId, receiverId, "Sent by hitesh to dinesh")

    await sendMessage(receiver2Id, receiverId, "Sent by prakash to dinesh")
    await sendMessage(receiverId, senderId, "send by dinesh to hitesh")

    await receivedMessage(senderId, receiverId, 101)
    await seenMessage(senderId, receiverId, 101)

    await userOffline(senderId)
    await userOffline(receiverId)
    await userOffline(receiver2Id)

    await userOnline(senderId)


}

dosometheing()

router.get('/createNewUser', async (req, res) => {
    let username = req.query.username
    let password = req.query.password
    let newId = await createNewUser(username, password)

    return res.json({ newId: newId })
})

router.get('/createNewThread', async (req, res) => {
    let senderId = req.query.sernderId;
    let receiverId = req.query.receiverId
    let newThreadId = await createNewThread(req.user.id, receiverId)
    res.json({ newThreadId: newThreadId })
})

router.get('/createNewThread', async (req, res) => {
    let senderId = req.query.sernderId;
    let receiverId = req.query.receiverId
    let newThreadId = await createNewThread(senderId, receiverId)
    res.json({ newThreadId: newThreadId })
})


router.get('/readWholeThread', async (req, res) => {
    await getAllmessage(req.user.id, req.query.receiverId).then(e => {
        return res.json(e)
    })
})

router.get('/getAllThread', async (req, res) => {
    if (await findUser(req.user.id)) {
        let retList = await findAllThreads(req.user.id)
        res.json(retList)
        // }
    }
})

router.post('/sendMessage', async (req, res) => {

    let senderIdtmep = req.user.id;
    let receiverIdtemp = req.body.receiverId || receiverId;
    console.log(senderIdtmep, receiverIdtemp)
    sendMessage(senderIdtmep, receiverIdtemp, req.body.message).then((e, ret) => {
        if (!e) {
            res.json({ message: "sent" })

        }
        else {
            res.json({ message: "not Sent" })
            console.log(e)
        }
    });

})
exports.version2Routes = router
