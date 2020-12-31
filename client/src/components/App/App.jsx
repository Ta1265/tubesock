import React, { useState } from 'react';
import NavBar from '../NavBar/NavBar';
import JoinPrompt from '../JoinPrompt/JoinPrompt';
import Room from '../Room/Room';
import './App.css';

export default function App() {
  const [userName, setUserName] = useState('');
  const [roomName, setRoomName] = useState('');
  const [numConnections, setNumConnections] = useState(0);
  const [prompt, setPrompt] = useState(true);

  return (
    <div className="app">
      <NavBar
        userName={userName}
        roomName={roomName}
        numConnections={numConnections}
      />
      <div>
        {prompt
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
              numConnections={numConnections}
              setNumConnections={(num) => setNumConnections(num)}
            />
          )}
      </div>

    </div>

  );
}
