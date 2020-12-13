const router = require('express').Router()
const { messageRouter } = require('./message')
const { version2Routes } = require('./version2Routes')
// router.get('/authenticate', (req, res, next) => {
//     next()
// })

router.use('/message', messageRouter)
// router.use('/version2', (req,res)=>{
//     console.log('recied')
// })
router.use('/version2', version2Routes)
module.exports = router;