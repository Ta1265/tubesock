import React, { useState, useEffect } from 'react';

export default function Chat({ socket }) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on('message', (newMsg) => {
      setMessages((state) => [...state, newMsg]);
    });
  }, []);

  const sendMessage = () => {
    socket.emit('message', input);
    setInput('');
  };
  return (
    <div>
      {messages && messages.map((msg, i) => (
        <div key={`msg_${i}`} className="message">{`${i + 1} ${msg}`}</div>
      ))}
      <input type="text" value={input} onChange={(e) => setInput(e.target.value)} />
      <button type="submit" onClick={sendMessage}>Send</button>
    </div>
  );
}
