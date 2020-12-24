import React, { createRef } from 'react';
// import CreateConnection from '../connections';
import Chat from './Chat';
import socket from '../socket';
import MyRTCconnector from '../connections';
// CreateConnection(socket);
// ReceiveConnection(socket);

export default class Room extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      usersInRoom: 0,
      numberConnections: 1,
      connectionState: 'not connected',
    };
    this.remoteStreams = [];
    this.rtcConnection = new MyRTCconnector(socket);
    this.localVideoRef = createRef();
    this.remoteVideoRef = createRef();
  }

  componentDidMount() {
    const { roomName, userName } = this.props;
    const { numberConnections } = this.state;
    const number = numberConnections;
    socket.emit('join_room', { roomName, userName });
    this.rtcConnection.setListeners((connection, state) => {
      this.setState({
        numberConnections: number + connection,
        connectionState: state,
      });
    });
    this.rtcConnection.setRemoteMediaListener((remoteStream) => {
      this.remoteVideoRef.current.srcObject = remoteStream;
      console.log(this.remoteVideoRef.current.srcObject);
    });
    this.rtcConnection.addLocalMediaStream((localStream) => {
      this.localVideoRef.current.srcObject = localStream;
    });
    this.setSocketListeners();
  }

  setSocketListeners() {
    socket.on('connection-count', (count) => {
      this.setState({ usersInRoom: count });
    });
  }

  render() {
    const { usersInRoom, connectionState, numberConnections } = this.state;
    const { roomName, userName } = this.props;

    return (
      <div>
        <Chat socket={socket} />
        <button type="submit" onClick={() => this.rtcConnection.sendOffer()}>sendOffer</button>
        {`
          roomName = ${roomName}
          userName = ${userName}
          userCount = ${usersInRoom}
          numberConnections = ${numberConnections}
          connectionState = ${connectionState}

        `}
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
