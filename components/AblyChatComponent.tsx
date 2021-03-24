import Head from 'next/head';
import { useState, useEffect, FormEvent } from 'react';
import { useChannel } from './AblyReactEffect';

export default function AblyChatComponent() {
  let inputBox = null;
  let channel: any;
  let ably;

  const [messageText, setMessageText] = useState('');
  const [receivedMessages, setMessages] = useState([]) as any;
  const [username, setUsername] = useState('');
  const messageTextIsEmpty = messageText.trim().length === 0;

  [channel, ably] = useChannel(process.env.NODE_ENV == 'development' ? 'chat-dev' : 'chat-main', (message: string) => {
    const history = receivedMessages.slice(-49);
    setMessages([...history, message]);
  });

  window['customChannel'] = channel;

  const sendChatMessage = (messageText: string) => {
    channel.publish({ name: 'chat-message', data: `${username}: ${messageText}` });
    setMessageText('');
    inputBox.focus();
    const presence = channel.presence.get().then(data => {
      console.log(data);
    });
    console.log(presence);
  }

  const handleFormSubmission = (event: FormEvent) => {
    event.preventDefault();
    sendChatMessage(messageText);
  }

  useEffect(() => {
    let name: string;
    while (name === null || name === undefined || name.trim().length === 0) {
      name = prompt('What is your name? (required)');
    }
    // console.log(ably.connection.id);
    // const name = ably.connection.id;
    setUsername(name);
    channel.publish({ name: 'chat-message', data: `${name} entered the chat.` });
  }, [ably]);

  return (
    <div className="chatHolder">
      <div className="chatText">
        {receivedMessages.map((message, index) => {
          const author = message.connectionId === ably.connection.id ? 'me' : 'other';
          return <div key={index} className="message" data-author={author}>{message.data}</div>;
        })}
      </div>
      <form onSubmit={handleFormSubmission} className='form'>
        <input
          ref={(element) => { inputBox = element; }}
          value={messageText}
          placeholder="Type a message..."
          onChange={e => setMessageText(e.target.value)}
          className='textarea'
        />
        <button type="submit" className='button' disabled={messageTextIsEmpty}>Send</button>
      </form>
    </div>
  )
}