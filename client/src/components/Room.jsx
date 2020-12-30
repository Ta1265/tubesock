import React, { useEffect } from 'react';
import Chat from './Chat';
import socket from '../socket';
import YouTubePlayer from './YouTubePlayer';
import VideoSearch from './VideoSearch';
import WebCamChat from './WebCamChat';
import '../styles/Room.css';

export default function Room(props) {
  const {
    roomName, userName, setNumConnections, numConnections,
  } = props;
  useEffect(() => {
    socket.emit('join_room', { roomName, userName });
    socket.on('connection-count', (count) => setNumConnections(count));
  }, []);

  return (
    <div className="roomContainer">
      <div className="containerOne">
        <YouTubePlayer socket={socket} />
        <WebCamChat
          socket={socket}
          setNumConnections={setNumConnections}
          numConnections={numConnections}
        />
      </div>
      <div className="containerTwo">
        <Chat socket={socket} />
        <VideoSearch selectVideo={(videoId) => socket.emit('change-video', videoId)} />
      </div>
    </div>
  );
}
