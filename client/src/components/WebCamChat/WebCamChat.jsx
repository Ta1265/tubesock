/* eslint-disable jsx-a11y/media-has-caption */
import React, { createRef } from 'react';
import MyRTCconnector from '../../myRTCconnector';
import RemoteVideo from './RemoteVideo';
import './WebCamChat.css';

export default class WebCamChat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      connections: [], // structure [ {socketId, rtcConnection}, ]
    };
    this.localVideoRef = createRef();
    this.disconnectCallBack = this.disconnectCallBack.bind(this);
  }

  componentDidMount() {
    const {
      socket, setNumConnections, roomName, userName,
    } = this.props;

    socket.on('getuptospeed-list', (usersMinusSelf) => {
      setNumConnections(usersMinusSelf.length + 1);
      const newConnections = usersMinusSelf.map((user) => this.createConnection(user.id));
      this.setState({ connections: newConnections });
    });

    socket.on('new-user-joined', (id) => {
      const { connections } = this.state;
      const newConnection = this.createConnection(id);
      setNumConnections(connections.length + 1);
      this.setState({ connections: [...connections, newConnection] });
    });

    socket.on('peer_connection_relay', (message, fromId) => {
      const { connections } = this.state;
      const designatedPeer = connections.filter((c) => c.socketId === fromId);
      designatedPeer[0].rtcConnection.handleMessage(message);
    });

    socket.emit('join_room', { roomName, userName });

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((localStream) => { this.localVideoRef.current.srcObject = localStream; });
  }

  disconnectCallBack(socketId) {
    const { connections } = this.state;
    const updatedConnections = connections.filter((con) => con.socketId !== socketId);
    this.setState({ connections: updatedConnections });
  }

  createConnection(socketId) {
    const { socket } = this.props;
    const rtcConnection = new MyRTCconnector(socket, socketId, this.disconnectCallBack);
    return { socketId, rtcConnection };
  }

  render() {
    const { connections } = this.state;
    const { socket } = this.props;
    return (
      <div className="WebCamChatContainer">
        <div className="webcamwrapper">
          <video
            className="video"
            ref={this.localVideoRef}
            autoPlay
            playsInline
            controls
            muted={false}
          />
          {connections.map((c) => <RemoteVideo key={c.socketId} socket={socket} connection={c} />) }
        </div>
      </div>
    );
  }
}
