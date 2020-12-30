import React, { useState, useEffect } from 'react';
import uuid from 'react-uuid';
import '../styles/Chat.css';

export default function Chat({ socket }) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on('message', (newMsg) => {
      setMessages((state) => [newMsg, ...state]);
    });
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    socket.emit('message', input);
    setInput('');
  };
  return (
    <div className="chatContainer">
      <div className="messagesContainer">
        {messages && messages.map((msg) => (
          <div
            key={uuid()}
          >
            {msg}
          </div>
        ))}
      </div>
      <form className="messageForm" onSubmit={sendMessage}>
        <input className="messageFormText" type="text" value={input} onChange={(e) => setInput(e.target.value)} />
        <input type="submit" value="Send" />
      </form>
    </div>
  );
}
