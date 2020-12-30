import React, { createRef } from 'react';
import MyRTCconnector from '../connections';
import '../styles/WebCamChat.css';

export default class WebCamChat extends React.Component {
  constructor(props) {
    super(props);
    const { socket } = props;
    this.state = {

    };
    this.rtcConnection = new MyRTCconnector(socket);
    this.localVideoRef = createRef();
    this.remoteVideoRef = createRef();
  }

  componentDidMount() {
    const { numConnections, setNumConnections } = this.props;
    this.rtcConnection.setListeners((connection, state) => {
      console.log('rtcConnection listener in room compdidmnt got connection/state=', connection, state);
      setNumConnections(numConnections + connection);
    });
    this.rtcConnection.setRemoteMediaListener((remoteStream) => {
      this.remoteVideoRef.current.srcObject = remoteStream;
      console.log('gpt remote stream?', this.remoteVideoRef.current.srcObject);
    });
    this.rtcConnection.addLocalMediaStream((localStream) => {
      this.localVideoRef.current.srcObject = localStream;
    });
  }

  render() {
    return (
      <div className="WebCamChatContainer">
        <div className="webcamwrapper">
          <video
            className="video"
            ref={this.localVideoRef}
            autoPlay
            playsInline
            muted
          />
          <video
            className="video"
            ref={this.remoteVideoRef}
            autoPlay
            playsInline
            muted
            onCanPlay={() => (this.remoteVideoRef.current.play())}
          />
        </div>
        <button className="startVideoBtn" type="button" onClick={() => this.rtcConnection.sendOffer()}>
          Start video chat
        </button>
      </div>
    );
  }
}
