const router = require('express').Router()
const { sendMessage } = require('../DbConnection')
const { createMessageThread } = require('../helper')
const {messageRouter} = require('./message')
router.get('/authenticate', (req, res, next) => {
    next()
})

router.use('/message', messageRouter)

module.exports = router;