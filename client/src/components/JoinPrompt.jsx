import React, { useState } from 'react';

export default function JoinPrompt({ setUser, setRoom, setPrompt }) {
  const [userNameEntry, setUserName] = useState('');
  const [roomToJoinEntry, setRoomToJoin] = useState('');

  return (
    <div>
      Username:
      <input type="text" value={userNameEntry} onChange={(e) => setUserName(e.target.value)} />
      Room name:
      <input type="text" value={roomToJoinEntry} onChange={(e) => setRoomToJoin(e.target.value)} />
      <button
        type="submit"
        onClick={() => {
          setUser(userNameEntry);
          setRoom(roomToJoinEntry);
          setPrompt(false);
        }}
      >
        Enter room
      </button>
    </div>
  );
}
