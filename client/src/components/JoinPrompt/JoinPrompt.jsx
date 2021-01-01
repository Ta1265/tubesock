/* eslint-disable no-alert */
import React, { useState } from 'react';
import './JoinPrompt.css';

export default function JoinPrompt({ setUser, setRoom, setPrompt }) {
  const [userNameEntry, setUserName] = useState('');
  const [roomToJoinEntry, setRoomToJoin] = useState('');

  return (
    <div className="joinWrapper">
      <div className="formWrapper">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (userNameEntry.length > 1 && userNameEntry.length < 10
              && roomToJoinEntry.length > 1 && roomToJoinEntry.length < 10) {
              setRoom(roomToJoinEntry);
              setUser(userNameEntry);
              setPrompt(false);
            } else {
              alert('Enter a username and a roomname between 1 and 10 characters');
            }
          }}
        >
          <label htmlFor="userNameInput">
            Username:
            <input type="text" value={userNameEntry} className="userNameInput" onChange={(e) => setUserName(e.target.value)} />
          </label>
          <label htmlFor="roomNameInput">
            Room:
            <input type="text" value={roomToJoinEntry} name="roomname" className="roomNameInput" onChange={(e) => setRoomToJoin(e.target.value)} />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>

    </div>
  );
}
