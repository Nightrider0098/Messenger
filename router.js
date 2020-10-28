const router = require('express').Router()
const { sendMessage } = require('./DbConnection')
const { createMessageThread } = require('./helper')


// import { sendMessage } from './DbConnection'
// import { createMessageThread } from './helper'

router.get('/authenticate', (req, res, next) => {
    next()
})

router.post('/sendMessage', (req, res, next) => {
    var messageDetails = {}
    messageDetails['threadId'] = createMessageThread({ sender: req.body.sender, receiver: req.body.receiver })
    messageDetails['sender'] = req.body.sender;
    messageDetails['receiver'] = req.body.receiver;
    messageDetails['message'] = req.body.message;
    console.log(req.body)
    if (sendMessage(messageDetails)) {
         res.sendStatus(200)
         console.log('sucess')

    }
    else {
         res.sendStatus(400)
    }
    next()

})
module.exports = router;