import Head from 'next/head';
import { useState, useEffect, FormEvent } from 'react';
import { useChannel } from '../compontents/AblyReactEffect';

export default function AblyChatComponent() {
  let inputBox = null;
  let channel: any;
  let ably;

  const [messageText, setMessageText] = useState('');
  const [receivedMessages, setMessages] = useState([]) as any;
  const [username, setUsername] = useState('');
  const messageTextIsEmpty = messageText.trim().length === 0;

  [channel, ably] = useChannel(process.env.NODE_ENV == 'development' ? 'chat-dev' : 'chat-test', (message: string) => {
    const history = receivedMessages.slice(-49);
    setMessages([...history, message]);
  });

  const sendChatMessage = (messageText: string) => {
    channel.publish({ name: 'chat-message', data: `${username}: ${messageText}` });
    setMessageText('');
    inputBox.focus();
  }

  const handleFormSubmission = (event: FormEvent) => {
    event.preventDefault();
    sendChatMessage(messageText);
  }

  useEffect(() => {
    const name = prompt('Qual seu nome?');
    setUsername(name);
    channel.publish({ name: 'chat-message', data: `${name} entered the chat.` });
  }, []);

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