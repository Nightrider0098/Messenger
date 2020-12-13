// import { urlencoded } from 'body-parser'
import React, { useState, useEffect } from 'react'
import ReceiverBigPanel from './ReceiverBigPanel'
import './MessageTray.css'
export default function MessageTray(props) {
    let [messageThread, setMessageThread] = useState([])
    let [message, setmessage] = useState("")
    useEffect(() => {
        if (props.receiverId !== "") {
            fetch(`/api/version2/readWholeThread?receiverId=${encodeURI(props.receiverId)}`, { method: 'GET' }).then(e => e.json()).then(e => {
                // console.log(e)
                let retData = []
                // [<div>{JSON.stringify(e[0].allMessageArray[0].messageArray)}</div>, <div>Hitesf</div>]
                for (let i = 0; i < e[0].allMessageArray[0].messageArray.length; i++) {
                    retData.push(<ReceiverBigPanel data={e[0].allMessageArray[0].messageArray[i]} key={"message_" + i} />)
                }
                setMessageThread(retData)
            }).catch(e => { alert(e) })
        }

    }, [props.receiverId])

    const inputHandler = (e) => {
        if (e.key === "Enter") {
            if (message !== "") {
                fetch(`/api/version2/sendMessage`, {
                    method: 'POST', body: JSON.stringify({ receiverId: props.receiverId, message: message }), credentials: 'include', headers: {
                        'Content-Type': 'application/json'
                        // 'Content-Type': 'application/x-www-form-urlencoded',
                    }
                }).then(e => e.json()).then(e => {
                    setmessage("")
                    fetch(`/api/version2/readWholeThread?receiverId=${encodeURI(props.receiverId)}`, {
                        method: 'GET', credentials: 'include',
                    }).then(e => e.json()).then(e => {
                        let retData = []
                        // [<div>{JSON.stringify(e[0].allMessageArray[0].messageArray)}</div>, <div>Hitesf</div>]
                        for (let i = 0; i < e[0].allMessageArray[0].messageArray.length; i++) {
                            retData.push(<ReceiverBigPanel data={e[0].allMessageArray[0].messageArray[i]} key={"message_" + i} />)
                        }
                        setMessageThread(retData)
                    }).catch(e => { alert(e) })
                }).catch(e => { alert(e) })
            }
        } else {
            if (e.key.length == 1 && e.key.match(/[ 1-9a-zA-Z]/)) {
                setmessage(message + e.key)
            }
            else if (e.key === "Backspace") {
                setmessage(message.substr(0, message.length - 1))
            }
        }

    }
    return (
        <div className="message-tray">
            <div className="message-tray-heading">
                <div style={{ display: 'inline-block' }}><img src="" alt="image is not uploaded" /></div>
                <div style={{ display: 'inline-block' }} > {String(props.receiverId)}</div>
            </div>
            {messageThread}
            <input className="message-input" onKeyDown={inputHandler} value={message} />
        </div>
    )
}
