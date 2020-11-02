import './App.css'
const { useEffect, useState } = require('react')
// requiredPaths;
// import React from 'react'

function App() {
  const [messages, UpdateMessages] = useState([{ message: "here will be your message" }])
  const [foundmessage, updateFound] = useState(false)
  useEffect(() => {
    // invoked every time when componentDidUpdate and componentDidMount
    if (!foundmessage) {
      updateFound(true);
      fetch(`/api/message?threadId=${document.getElementById('threadId').value}`)
        .then((res) => res.json())
        .then((res) => {
          console.log("fetching the messages for the first time")
          UpdateMessages(res)
        })
        .catch((err) => { console.log(err) })
      // setInterval(() => {
      //   console.log('searched for update')
      //   fetch(`/api/message/update?threadId=Hitesh${document.getElementById('receiver').value || 'Dinesh'}`)
      //     .then((res) => res.json())
      //     .then((res) => {
      //       console.log("updated the message")
      //       UpdateMessages(res)
      //     })
      //     .catch((err) => { console.log(err) })
      // }, 1000);
    }

  })

  async function postData(url, data) {
    // Default options are marked with *

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
        // there is alway some issue here
        //   'Content-Type': 'x-www-form-urlencoded',
      },
      body: JSON.stringify(data)
    })
    return response
  }

  const getUpdate = () => {
    console.log('searched for update')
    fetch(`/api/message/update?threadId=${document.getElementById('threadId').value}`)
      .then((res) => res.json())
      .then((res) => {
        console.log("updated the message")
        UpdateMessages(res)
      })
      .catch((err) => { console.log(err) })
  }

  const sendMessage = () => {
    postData('/api/message/message', { threadId: document.getElementById('threadId').value, message: document.getElementById('inputMessage').value }).then(e => {
      console.log("message sent ok")
    }).catch((e) => {
      alert(e)
    })
  }


  const getAllMessage = () => {
    fetch(`/api/message?threadId=${document.getElementById('threadId').value}`)
      .then((res) => res.json())
      .then((res) => {
        console.log("fetched complete message Thread")
        UpdateMessages(res)
      })
      .catch((err) => {
        alert('Error while fetching the complete thread')
        console.log(err)
      })
  }

  async function patchRequest(url, data) {
    // Default options are marked with *

    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
        // there is alway some issue here
        //   'Content-Type': 'x-www-form-urlencoded',
      },
      body: JSON.stringify(data)
    })
    return response.json();
  }
  const seenMessage = () => {
    patchRequest("/api/message/message", { seen: true, threadId: document.getElementById('threadId').value, messageId: '5f9f9db47e926c2f8488e515' }).then(() => {
      getAllMessage()
    })
  }

  const createNewThread = () => {
    fetch('/api/message/new').then((res) => {
      console.log('new id created')
      alert("new id created")
      console.log(res)
    }).catch(() => {
      console.log("failed to send request")
    })
  }
  return (

    <div id="background-warpper"  >
      <div id="messenger-head" className="row p-5" >
        <div className="col-lg-8 ">
          <div id="message-holder">
            {JSON.stringify(messages)}
          </div>

        </div>
        <div className="col-lg-4">
          <input placeholder="threadId" className="input-field" id="threadId" />
          <input placeholder="Send Message..."  className="input-field" id="inputMessage" />
          <button onClick={sendMessage}  className="btn btn-dark">Send</button>
          <button onClick={getUpdate}  className="btn btn-dark" >Get Update</button>
          <button onClick={getAllMessage}  className="btn btn-dark" > Get All</button>
          <button onClick={seenMessage}  className="btn btn-dark" >Seen</button>
          <button onClick={createNewThread}  className="btn btn-dark" >New thread</button>
        </div>
      </div >
    </div >

  );
}

export default App;
