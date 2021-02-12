/* eslint-disable no-alert */
import React, { useState } from 'react';
import './JoinPrompt.css';

interface Props {
  setUser: (userName: string) => void;
  setRoom: (roomName: string) => void;
  setPrompt: (display: boolean) => void;
}

const JoinPrompt = ({ setUser, setRoom, setPrompt }: Props): JSX.Element => {
  const [userNameEntry, setUserName] = useState('');
  const [roomToJoinEntry, setRoomToJoin] = useState('');

  return (
    <div className="joinWrapper">
      <div className="formWrapper">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (userNameEntry.length < 1) setUser('Anonymous');
            else setUser(roomToJoinEntry);
            if (roomToJoinEntry.length < 1) setRoom('testroom');
            else setRoom(roomToJoinEntry);
            setPrompt(false);
          }}
        >
          <label htmlFor="userNameInput">
            Username:
            <input
              type="text"
              value={userNameEntry}
              className="userNameInput"
              onChange={(e) => setUserName(e.target.value)}
            />
          </label>
          <label htmlFor="roomNameInput">
            Room:
            <input
              type="text"
              value={roomToJoinEntry}
              name="roomname"
              className="roomNameInput"
              onChange={(e) => setRoomToJoin(e.target.value)}
            />
          </label>
          <input type="submit" value="Submit" />
          <input
            className="tryitbtn"
            type="submit"
            value="Just try it! (random)"
          />
        </form>
      </div>
    </div>
  );
};

export default JoinPrompt;
