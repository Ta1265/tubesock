import React, { useState, useEffect } from 'react';
import * as uuid from 'uuid';
import './Chat.css';

interface Props {
  socket: SocketIOClient.Socket;
}

export default function Chat({ socket }: Props): JSX.Element {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Array<string>>([]);

  useEffect(() => {
    socket.on('message', (newMsg: string) => {
      setMessages((state: Array<string>) => [newMsg, ...state]);
    });
  }, []);

  const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    socket.emit('message', input);
    setInput('');
  };
  return (
    <div className="chatContainer">
      <div className="messagesContainer">
        {messages && messages.map((msg) => <div key={uuid.v4()}>{msg}</div>)}
      </div>
      <form className="messageForm" onSubmit={sendMessage}>
        <input
          className="messageFormText"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <input type="submit" value="Send" />
      </form>
    </div>
  );
}
