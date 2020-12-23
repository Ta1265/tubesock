import React, { useState, useEffect, useRef } from 'react';

export default function WebCam() {
  const videoRef = useRef();
  const [mediaStream, setMediaStream] = useState(null);

  // Notes: 1st render videoRef attaches, getUserMedia promise exec's triggers second render
  useEffect(() => {
    if (!mediaStream) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((stream) => setMediaStream(stream))
        .catch((err) => console.log(err.message));
    }
    return !mediaStream
      ? null
      : () => mediaStream.getTracks().forEach((track) => track.stop());
  }, [mediaStream]);

  if (mediaStream && videoRef.current && !videoRef.current.srcObject) {
    videoRef.current.srcObject = mediaStream;
  }

  function handleCanPlay() {
    videoRef.current.play();
  }
  console.log('ran webcam ref=', videoRef, mediaStream);

  return (
    <video ref={videoRef} onCanPlay={handleCanPlay} autoPlay playsInline muted />
  );
}
