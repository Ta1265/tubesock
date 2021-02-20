/* eslint-disable no-alert */
import React, { useState } from 'react';
import styles from './JoinPrompt.module.css';

interface Props {
  setUser: (userName: string) => void;
  setRoom: (roomName: string) => void;
  setPrompt: (display: boolean) => void;
}

const JoinPrompt = ({ setUser, setRoom, setPrompt }: Props): JSX.Element => {
  const [userNameEntry, setUserName] = useState('');
  const [roomToJoinEntry, setRoomToJoin] = useState('');

  return (
    <div className={styles.joinWrapper}>
      <div className={styles.formWrapper}>
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
          <label htmlFor={styles.userNameInput}>
            Username:
            <input
              type="text"
              value={userNameEntry}
              className={styles.userNameInput}
              onChange={(e) => setUserName(e.target.value)}
            />
          </label>
          <label htmlFor={styles.roomNameInput}>
            Room:
            <input
              type="text"
              value={roomToJoinEntry}
              name="roomname"
              className={styles.roomNameInput}
              onChange={(e) => setRoomToJoin(e.target.value)}
            />
          </label>
          <input type="submit" value="Join Room" />
          <input
            className={styles.tryitbtn}
            type="submit"
            value="Just try it! (random)"
          />
        </form>
      </div>
    </div>
  );
};

export default JoinPrompt;
