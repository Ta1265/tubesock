import React, { createRef } from 'react';
import CreateConnection from '../connections';
import Chat from './Chat';
import socket from '../socket';

// CreateConnection(socket);
// ReceiveConnection(socket);

export default class Room extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      connectionCount: 0,
    };

    this.remoteStreams = [];
    this.peerConnection = CreateConnection(socket);
    this.localVideoRef = createRef();
    this.remoteVideoRef = createRef();

    this.sendOffer = this.sendOffer.bind(this);
  }

  componentDidMount() {
    const { roomName, userName } = this.props;
    this.setSocketListeners();
    socket.emit('join_room', { roomName, userName });
    this.setRemoteMediaListener();
    this.getLocalStream();
  }

  getLocalStream() {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        this.localVideoRef.current.srcObject = stream;
        this.addLocalMediaToStream(stream);
      });
  }

  setSocketListeners() {
    socket.on('connection-count', (count) => {
      this.setState({ connectionCount: count });
    });
  }

  setRemoteMediaListener() {
    this.peerConnection.addEventListener('track', (event) => {
      console.log('setRemoteMediaListener triggered');
      const stream = new MediaStream();
      stream.addTrack(event.track, stream);
      this.remoteVideoRef.current.srcObject = stream;
      console.log(this.remoteVideoRef.current.srcObject);
    });
  }

  addLocalMediaToStream(localMediaStream) {
    localMediaStream.getTracks().forEach((track) => {
      this.peerConnection.addTrack(track, localMediaStream);
    });
  }

  sendOffer() {
    // send connection offer
    let offer;
    this.peerConnection.createOffer()
      .then((off) => {
        offer = off;
        return this.peerConnection.setLocalDescription(offer);
      })
      .then(() => socket.emit('webcam_con', { offer }))
      .catch((err) => console.log('error createConnection', err.message));
  }

  render() {
    const { connectionCount } = this.state;
    const { roomName, userName } = this.props;

    return (
      <div>
        <Chat socket={socket} />
        <button type="submit" onClick={this.sendOffer}>sendOffer</button>
        <button type="submit" onClick={this.reRender}>sendOffer</button>
        {`
          roomName = ${roomName}
          userName = ${userName}
          userCount = ${connectionCount}
        `}
        {/* <Chat socket={socket} /> */}
        {/* <WebCam socket={socket} /> */}

        localVideo
        <video
          ref={this.localVideoRef}
          autoPlay
          playsInline
          muted
        />
        remote video
        <video
          ref={this.remoteVideoRef}
          autoPlay
          playsInline
          muted
          onCanPlay={() => (this.remoteVideoRef.current.play())}
        />
      </div>
    );
  }
}
