import React, { useState } from 'react';
import styles from '../styles/app.css';

export default function App({ JoinPrompt, Room }) {
  const [userName, setUserName] = useState('');
  const [roomName, setRoomName] = useState('');
  const [prompt, setPrompt] = useState(true);

  return (
    <div className={styles.app}>
      <div className={styles.navbar}>
        <div className={styles.navtitle}>TubeSock</div>
        <div className={styles.navroomname}>{roomName || ''}</div>
      </div>
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
            />
          )}
      </div>

    </div>

  );
}
