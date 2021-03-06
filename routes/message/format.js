const formatMessage = (details) => {
    let formatDetails = {}
    // console.log("thee messae",details.messageArray[0].seen)
    formatDetails['seen'] = details.seen;
    formatDetails['received'] = details.messagereceived;
    formatDetails['deleted'] = details.deleted;
    formatDetails['time'] = details.time;
    formatDetails['message'] = details.message;
    formatDetails['id'] = details._id
    return formatDetails
}

// console.log(formatMessage({ seen: true }))
const formatMessageThread = (threadDetails) => {
    const threadFormatDetails = {}
    threadFormatDetails.threadId = threadDetails.threadId;
    threadFormatDetails.messages = threadDetails.messageArray.map(formatMessage)
    console.log("formatting the message thread!!")
    return threadFormatDetails
}


exports.formatMessage = formatMessage;
exports.formatMessageThread = formatMessageThread;