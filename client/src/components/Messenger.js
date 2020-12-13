import React, { useState, useEffect } from 'react'

import './Messenger.css'
import 'bootstrap/dist/css/bootstrap.css';
import MessageTray from './MessageTray'
import RecieverSmallPanel from './RecieverSmallPanel'
export default function App() {
    const [senderId, setSenderId] = useState("")
    const [receiverId, setReciverId] = useState("")
    const [listofReciever, setlistofReciever] = useState([])

    const changeBigPanel = (newId) => {
        setReciverId(newId)
        // console.log('new id set',newId)
    }
    const RecieverSmallPanelConstructor = () => {
        let retArray = []
        for (let i = 0; i < listofReciever.length; i++)
            retArray.push(<RecieverSmallPanel id={listofReciever[i]} key={listofReciever[i] + "_"} changeBigPanel={changeBigPanel} />)
        // console.log(retArray)
        return retArray
    }

    useEffect(() => {
        fetch('/api/version2/getAllThread', { method: "GET", credentials: "include" }).then(e => e.json()).then(e => {
            setlistofReciever((e))
            setReciverId(e[0])
        })
    }, [])
    return (
        <div className="messenger-wrapper">

            <div className="contact-list-wrapper">
                <h4>Your Contacts</h4>
                <div className="contact-list">
                    {RecieverSmallPanelConstructor()}
                    {/* {"Jello"} */}
                </div>
            </div>
            <div className="message-tray-wrapper ">
                <MessageTray senderId={senderId} receiverId={receiverId}></MessageTray>
            </div>

        </div >
    )
}
