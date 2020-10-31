const router = require('express').Router()
const { sendMessage, getMessage, deleteMessage, threadExist, startNewThread, readMessage, receivedMessage } = require('../../DbConnection')
const { createMessageThread } = require('../../helper')
const { formatMessage, formatMessageThread } = require('./format')

router.post('/message', (req, res) => {
    var messageDetails = {}
    messageDetails['threadId'] = createMessageThread({ sender: req.body.sender, receiver: req.body.receiver })
    messageDetails['sender'] = req.body.sender;
    messageDetails['receiver'] = req.body.receiver;
    messageDetails['message'] = req.body.message;
    threadExist(messageDetails['threadId']).then((condi) => {
        if (condi) {
            sendMessage(messageDetails).then(() => {
                res.sendStatus(200)
            }, () => {
                res.sendStatus(400)
            })
        }
        else {
            startNewThread(messageDetails).then(() => {
                res.sendStatus(200)
            }, () => {
                res.sendStatus(400)
            })
        }
    }).catch(() => res.sendStatus(400))

})

router.get('/', (req, res) => {
    var messageDetails = {}
    messageDetails['threadId'] = createMessageThread({ sender: req.query.sender, receiver: req.query.receiver })
    getMessage(messageDetails).then((result) => {
        res.json(formatMessageThread(result))
    }, () => { res.sendStatus(404) })
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
    messageDetails['threadId'] = createMessageThread({ sender: req.body.sender, receiver: req.body.receiver })
    messageDetails['read'] = req.body.read;
    messageDetails['seen'] = req.body.seen;

    if (req.body.read !== undefined) {
        await readMessage(req.messageId)
    }
    if (req.body.seen !== undefined) {
        await receivedMessage(req.body.messageId)
    }
})

exports.messageRouter = router;