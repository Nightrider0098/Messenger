import React from 'react'
import './RecieverSmallPanel.css'
export default function RecieverSmallPanel(props) {
    return (
        <div onClick={() => { props.changeBigPanel(props.id); }}>

            <div className="contact-tiles">
                <img src="/images/4.jpg" alt="image not uploaded" width="40px" className="profile-icon" />
                <div className="contact-tile-text">
                    <div className="contact-name-holder">{props.id}</div>
                    <div>{props.message || "hiii"}</div>
                </div>
                <div className="contact-tile-count">
                    <div className="message-count-circle"> 1</div>
                </div>
            </div >
        </div >
    )
}
