import React, { useState, useEffect } from 'react';
import Chat from './Chat';
// import Video from './video';
import WebCam from './WebCam';
import socket from '../socket';

export default function Room({ roomName, userName }) {
  // const [users, setUsers] = useState('');

  useEffect(() => {
    socket.emit('join_room', { roomName, userName }, (err) => {
      if (err) console.log('connection Error', err);
    });
  }, [roomName, userName]); // only run this hook if roomName or userName

  return (
    <div>
      {`
        roomName = ${roomName}
        userName = ${userName}
      `}
      <Chat socket={socket} />
      <WebCam />
    </div>

  );
}
