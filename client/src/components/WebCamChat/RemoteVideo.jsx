/* eslint-disable jsx-a11y/media-has-caption */
import React, { useEffect, useRef } from 'react';

export default function RemoteVideo({ connection }) {
  const { rtcConnection } = connection;
  const remoteVideoRef = useRef();
  useEffect(() => {
    rtcConnection.setRemoteMediaListener((remoteStream) => {
      remoteVideoRef.current.srcObject = remoteStream;
    });
    setTimeout(() => {
      if (!rtcConnection.contactWasInitiated()) {
        rtcConnection.sendOffer();
      }
    }, (Math.random() * 2000)); // randomize who sends the offer
  }, []);

  console.log(remoteVideoRef.current);
  return (

    <video
      className="video"
      ref={remoteVideoRef}
      controls
      playsInline
      autoPlay
      muted={false}
      onCanPlay={() => (remoteVideoRef.current.play())}
    />

  );
}
