/* eslint-disable jsx-a11y/media-has-caption */
import React, { useEffect, useRef } from 'react';
import MyRTCconnector from '../../myRTCconnector';
import styles from './WebCamChat.module.css';

interface Props {
  rtcConnection: MyRTCconnector;
}
export default function RemoteVideo({ rtcConnection }: Props): JSX.Element {
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    rtcConnection.setRemoteMediaListener((remoteStream: MediaStream): void => {
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;
    });
    setTimeout(() => {
      if (!rtcConnection.contactWasInitiated()) {
        console.log('sending offer');
        rtcConnection.sendOffer();
      }
    }, (Math.random() * 2000)); // randomize who sends the offer
  }, []);

  return (
    <video
      className={styles.video}
      ref={remoteVideoRef}
      controls
      playsInline
      autoPlay
      muted={false}
      onCanPlay={() => (remoteVideoRef.current?.play())}
    />
  );
}
