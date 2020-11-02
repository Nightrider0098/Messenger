const createMessageThread = (data) => {
    return data.sender + data.receiver
}

const isAuthorized = (req, res, done) => {
    console.log('Checking the authentication')
    if (req.user === undefined) {
        console.log(`Authorized ${req.user.username}!!`)
        return res.sendStatus(400)
    }
    else {
        console.log("Unauthorized used!!")
        return done()
    }
}

exports.createMessageThread = createMessageThread
exports.isAuthorized = isAuthorized
