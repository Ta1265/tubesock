import React, { useState } from 'react';
import NavBar from '../NavBar/NavBar';
import JoinPrompt from '../JoinPrompt/JoinPrompt';
import Room from '../Room/Room';
import './App.css';

const App = (): JSX.Element => {
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
        {prompt ? (
          <JoinPrompt
            setUser={(data: string): void => setUserName(data)}
            setRoom={(data: string): void => setRoomName(data)}
            setPrompt={(data: boolean): void => setPrompt(data)}
          />
        ) : (
          <Room
            userName={userName}
            roomName={roomName}
            numConnections={numConnections}
            setNumConnections={(num: number): void => setNumConnections(num)}
          />
        )}
      </div>
    </div>
  );
};

export default App;
