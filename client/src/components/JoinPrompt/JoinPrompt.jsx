import React, { useState } from 'react';
import './JoinPrompt.css';

export default function JoinPrompt({ setUser, setRoom, setPrompt }) {
  const [userNameEntry, setUserName] = useState('');
  const [roomToJoinEntry, setRoomToJoin] = useState('');

  return (
    <div className="formWrapper">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setUser(userNameEntry);
          setRoom(roomToJoinEntry);
          setPrompt(false);
        }}
      >
        <label htmlFor="userNameInput">
          Username:
          <input type="text" value={userNameEntry} className="userNameInput" onChange={(e) => setUserName(e.target.value)} />
        </label>
        <label htmlFor="roomNameInput">

          Room name:
          <input type="text" value={roomToJoinEntry} name="roomname" className="roomNameInput" onChange={(e) => setRoomToJoin(e.target.value)} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
}
