import React from 'react';
import io from 'socket.io-client';
import Chat from '../Chat/Chat';
import YouTubePlayer from '../YouTubePlayer/YouTubePlayer';
import VideoSearch from '../VideoSearch/VideoSearch';
import WebCamChat from '../WebCamChat/WebCamChat';
import styles from './Room.module.css';

const socket: SocketIOClient.Socket = io();

interface Props {
  userName: string;
  roomName: string;
  numConnections: number;
  setNumConnections: (num: number) => void;
}

const Room = ({
  roomName,
  userName,
  setNumConnections,
  numConnections,
}: Props): JSX.Element => (
  <div className={styles.roomContainer}>
    <div className={styles.containerOne}>
      <YouTubePlayer socket={socket} />
      <WebCamChat
        socket={socket}
        numConnections={numConnections}
        setNumConnections={setNumConnections}
        roomName={roomName}
        userName={userName}
      />
    </div>
    <div className={styles.containerTwo}>
      <Chat socket={socket} />
      <VideoSearch
        socket={socket}
        // selectVideo={(videoId) => socket.emit('change-video', videoId)}
      />
    </div>
  </div>
);
export default Room;
