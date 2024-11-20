import { useEffect, useState } from 'react';
import './App.css';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import axios from 'axios';

function App() {
  const [username, setUsername] = useState('username')
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState('')
  let allMessages = [];

  useEffect(() => {
    // Pusher.logToConsole = true;

    // const pusher = new Pusher('f459af705400ac2b079e', {
    //   cluster: 'eu'
    // });



    window.Echo = new Echo({
      authEndpoint: 'http://localhost:8000/api/broadcasting/auth',
      broadcaster: 'pusher',
      key: 'f459af705400ac2b079e',
      cluster: 'eu',
      encrypted: true,
      authorizer: (channel, options) => {
        return {
          authorize: (socketId, callback) => {
            axios.post('http://localhost:8000/api/broadcasting/auth',
              {
                socket_id: socketId,
                channel_name: channel.name
              },
              {
                withCredentials: true,
                headers: {
                  Accept: 'application/json',
                  Authorization: 'Bearer 2|0jmkmqEMI7JTEXYK4MWT6wACAJ8jUjkGJVgIAMwq1c57ae6a'
                },
              }
            )
              .then(response => {
                callback(false, response.data);
              })
              .catch(error => {
                callback(true, error);
              });
          }
        };
      },
      // auth: {
      //   headers: {
      //     authorization: 'Bearer 2|0jmkmqEMI7JTEXYK4MWT6wACAJ8jUjkGJVgIAMwq1c57ae6a'
      //   }
      // }
    });

    window.Echo.private('chat')
      .listen('MessageReceived', (e) => {
        allMessages.push(e);
        setMessages(allMessages)
      })

    /*const channel = pusher.subscribe('chat');
    channel.bind('message', function (data) {
      allMessages.push(data);
      setMessages(allMessages)
    });
    */
  }, [])

  const submit = async e => {
    e.preventDefault();

    await fetch('http://localhost:8000/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username,
        message
      })
    });

    setMessage('');
  }

  return (
    <div className="container">
      <div className="d-flex flex-column align-items-stretch flex-shrink-0 bg-body-tertiary">
        <div className="d-flex align-items-center flex-shrink-0 p-3 text-decoration-none border-bottom">
          <input className="fs-5 fw-semibold" value={username} onChange={e => setUsername(e.target.value)} />
        </div>
        <div className="list-group list-group-flush border-bottom scrollarea">
          <div>
          </div>
          {messages.map((message, index) => (
            <div className="list-group-item list-group-item-action py-3 lh-sm" key={index}>
              <div className="d-flex w-100 align-items-center justify-content-between">
                <strong className="mb-1">{message.username}</strong>
              </div>
              <div className="col-10 mb-1 small">
                {message.message}
              </div>
            </div>
          ))}

        </div>

      </div>

      <form onSubmit={e => submit(e)}>
        <input className="form-control" placeholder='Write a message' value={message} onChange={e => setMessage(e.target.value)}>

        </input>
      </form>
    </div>
  );
}

export default App;
