import React, { useEffect } from 'react';
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
