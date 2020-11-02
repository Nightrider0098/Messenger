
const { useEffect, useState } = require('react')


function App() {
  const [messages, UpdateMessages] = useState([{ message: "here will be your message" }])
  const [foundmessage, updateFound] = useState(false)
  useEffect(() => {
    // invoked every time when componentDidUpdate and componentDidMount
    if (!foundmessage) {
      updateFound(true);
      fetch('/api/message?sender=Hitesh&receiver=Urmila')
        .then((res) => res.json())
        .then((res) => {
          console.log("fetching the messages for the first time")
          UpdateMessages(res)
        })
        .catch((err) => { console.log(err) })
      setInterval(() => {
        console.log('searched for update')
        fetch('/api/message/update?id=HiteshUrmila')
          .then((res) => res.json())
          .then((res) => {
            console.log("updated the message")
            UpdateMessages(res)
          })
          .catch((err) => { console.log(err) })
      }, 5000);
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
      body: JSON.stringify({
        sender: "Hitesh",
        receiver: "Urmila",
        message: String(data.value)
      })
    })
    return response.json();
  }
  const sendMessage = () => {
    postData('/api/message/message', { value: document.getElementById('inputMessage').value }).then(e => {
      console.log(e)
    })
  }
  return (
    <div id="messenger-head" >
      <code>
        {JSON.stringify(messages)}
      </code>
      <input placeholder="Send Message..." onChange={sendMessage} id="inputMessage" />
    </div >
  );
}

export default App;
