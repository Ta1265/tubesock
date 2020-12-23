import React, { useState } from 'react';

export default function App({ JoinPrompt, Room }) {
  const [userName, setUserName] = useState('');
  const [roomName, setRoomName] = useState('');
  const [prompt, setPrompt] = useState(true);

  return (
    prompt
      ? (
        <JoinPrompt
          setUser={(data) => setUserName(data)}
          setRoom={(data) => setRoomName(data)}
          setPrompt={(data) => setPrompt(data)}
        />
      )
      : (
        <Room
          userName={userName}
          roomName={roomName}
        />
      )

  );
}
