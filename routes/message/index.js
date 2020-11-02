const router = require('express').Router()
const { sendMessage, getMessage, deleteMessage, threadExist, startNewThread, readMessage, receivedMessage, findUpdate, newUser } = require('../../DbConnection')
const { createMessageThread } = require('../../helper')
const { formatMessageThread } = require('./format')

router.post('/message', (req, res) => {
    console.log('encountered send message request')
    var messageDetails = {}
    messageDetails['threadId'] = req.body.threadId
    messageDetails['message'] = req.body.message;
    console.log('searching for existance of thread')
    threadExist(messageDetails['threadId']).then((condi) => {
        if (condi) {
            console.log('Found thread!!')
            sendMessage(messageDetails).then(() => {
                console.log('message sent sucessfully!!!')
                res.sendStatus(200)
            }, () => {
                console.log("cant send the message")
                res.sendStatus(400)
            })
        }
        else {
            console.log(`didn't found the thread!!`)
            startNewThread(messageDetails).then(() => {
                console.log('sucessfully created the thread and sent the message!!!')
                res.sendStatus(200)
            }, () => {
                console.log(`can't create a thread and send the message`)
                res.sendStatus(400)
            })
        }
    }).catch(() => res.sendStatus(400))

})

router.get('/', (req, res) => {
    var messageDetails = {}
    messageDetails['threadId'] = req.query.threadId
    if (req.query.threadId === undefined || req.query.threadId === "") {
        console.log("threadId is not given")
        res.sendStatus(400)
    } else
        getMessage(messageDetails).then((result) => {
            console.log('sending the Conversation')
            res.json(formatMessageThread(result))
        }, () => { res.sendStatus(500) })
})

router.get('/update', (req, res) => {
    console.log("find update request encountered!! threadId", req.query)
    findUpdate(req.query.threadId).then((result) => {
        console.log("sending the update status")
        return res.json(result)
    })

})

router.delete('/message', (req, res) => {
    var messageDetails = {}
    messageDetails['threadId'] = createMessageThread({ sender: req.body.sender, receiver: req.body.receiver })
    // console.log(messageDetails.threadId, "thread id")
    messageDetails['id'] = "5f9cff92f0dd57206c108ea7"
    deleteMessage(messageDetails).then(result => res.sendStatus(200)).catch(err => {
        console.log(err);
        res.sendStatus(400)
    })


})

router.patch('/message', async (req, res) => {
    var messageDetails = {}
    messageDetails['threadId'] = req.body.threadId
    messageDetails['seen'] = req.body.seen;
    messageDetails['received'] = req.body.read;

    if (req.body.seen !== undefined) {
        console.log("received a seen message request")
        await readMessage(req.body.threadId)
    }
    if (req.body.received !== undefined) {
        await receivedMessage(req.body.messageId)
    }
})

router.get('/new', async (req, res) => {
    console.log("request for new id")
    newUser({
        username: "Lakshmi",
        password: "New"
    }).then(user => {
        res.json({ userId: user })
    }).catch(() => {
        console.log('failed to create a id')
        res.sendStatus(500)
    })
})
exports.messageRouter = router;