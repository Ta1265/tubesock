import React, { useState, useEffect, useRef } from 'react';
import MyRTCconnector from './myRTCconnector';

export default function RemoteVideo({ socket }) {
  const remoteVideoRef = useRef();
  const rtcCon = new MyRTCconnector(socket);

  useEffect(() => {

  });

  return (
    <video
      className="video"
      ref={remoteVideoRef}
      autoPlay
      playsInline
      muted
      onCanPlay={() => (this.remoteVideoRef.current.play())}
    />
  );
}
