import React from 'react'
import './ReceiverBigPanel.css'
// state less pure component
export default function ReceiverBigPanel(props) {
    const displayMessage = () => {
        console.log(props.data)
        if (props.data.mine)
            return (
                <div className="message-box-block-wrapper-right">
                    <div className="message-box-right">
                        {props.data.message}
                    </div>
                </div>)
        else
            return (
                <div className="message-box-block-wrapper-left">
                    <div className="message-box-left">
                        {props.data.message}
                    </div>
                </div>)


    }


    return (

        <>{displayMessage()}</>
    )
}
