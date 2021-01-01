import React from 'react';
import io from 'socket.io-client';
import Chat from '../Chat/Chat';
import YouTubePlayer from '../YouTubePlayer/YouTubePlayer';
import VideoSearch from '../VideoSearch/VideoSearch';
import WebCamChat from '../WebCamChat/WebCamChat';
import './Room.css';

const socket = io();

export default function Room(props) {
  const {
    roomName, userName, setNumConnections, numConnections,
  } = props;

  return (
    <div className="roomContainer">
      <div className="containerOne">
        <YouTubePlayer socket={socket} />
        <WebCamChat
          socket={socket}
          numConnections={numConnections}
          setNumConnections={setNumConnections}
          roomName={roomName}
          userName={userName}
        />
      </div>
      <div className="containerTwo">
        <Chat socket={socket} />
        <VideoSearch socket={socket} selectVideo={(videoId) => socket.emit('change-video', videoId)} />
      </div>
    </div>
  );
}
