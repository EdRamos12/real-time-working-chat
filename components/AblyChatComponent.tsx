import Head from 'next/head';
import { useState, useEffect, FormEvent } from 'react';
import { useChannel } from './AblyReactEffect';

// i can separate where messages will be displayed
// by using names (or channel by passing on the object) and showing them in their respective names
// with front-end, noted that

export default function AblyChatComponent() {
  let inputBox = null;
  let channel: any;
  let ably;

  const [messageText, setMessageText] = useState('');
  const [receivedMessages, setReceivedMessages] = useState([]) as any;
  const [username, setUsername] = useState('');
  const [userList, setUserList] = useState<String[]>([]);
  const messageTextIsEmpty = messageText.trim().length === 0;


  [channel, ably] = useChannel(process.env.NODE_ENV == 'development' ? 'chat-dev' : 'chat-main', (message: string) => {
    const history = receivedMessages.slice(-49);
    setReceivedMessages([...history, message]);
  });

  const sendChatMessage = (messageText: string) => {
    channel.publish({ data: { text: messageText, username } });
    setMessageText('');
    inputBox.focus();
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
    setUsername(name);
    channel.presence.get().then((data: any) => {
      const formatToUsernameOnly = data.map(el => (el.data.username));
      setUserList(formatToUsernameOnly);
    });
    channel.presence.enter({ username: name });
  }, []);

  useEffect(() => {
    channel.presence.subscribe(data => {
      if (data.action == 'enter') {
        setUserList(previous => {
          if (previous.indexOf(data.data.username) == -1) return [...previous, data.data.username];
          return previous;
        });
      }
      if (data.action == 'leave') {
        setUserList(previous => {
          const i = previous.indexOf(data.data.username);
          if (i > -1) {
            return previous.filter(item => item !== data.data.username);
          };
          return previous;
        });
      }
    });
  }, [userList])

  useEffect(() => {
    channel.publish({ data: { text: `${username} entered the chat.` } });
    if (userList.indexOf(username) == -1) {
      setUserList(previous => [...previous, username]);
    }
  }, [username]);

  return (
    <div className="chatHolder">
      <div className="chatText">
        {receivedMessages.map((message, index) => {
          const author = message.connectionId === ably.connection.id ? 'me' : 'other';
          return <div key={index} className="message" data-author={author}>{message.data.username && `${message.data.username}: `}{message.data.text}</div>;
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
      {userList.map((user, index) => {
        return <p key={index}>{user}</p>
      })}
    </div>
  )
}