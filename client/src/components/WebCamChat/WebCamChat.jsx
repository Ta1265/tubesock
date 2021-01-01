import React, { createRef } from 'react';
import MyRTCconnector from './myRTCconnector';
import RemoteVideo from './RemoteVideo';
import './WebCamChat.css';

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
    this.rtcConnection.setListeners(() => {
      this.remoteVideoRef.current.srcObject = null;
    });
    this.rtcConnection.setRemoteMediaListener((remoteStream) => {
      this.remoteVideoRef.current.srcObject = remoteStream;
      console.log('got remote stream?', this.remoteVideoRef.current.srcObject);
    });
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((localStream) => {
        this.localVideoRef.current.srcObject = localStream;
      });
  }

  render() {
    // const { remoteOfferSent } = this.state;
    const { numConnections } = this.props;
    console.log('webcam rerenderedA;');
    return (
      <div className="WebCamChatContainer">

        <button
          className="startVideoBtn"
          type="button"
          onClick={() => {
            this.rtcConnection.sendOffer();
          }}
        >
          Enter Video Chat
        </button>
        )
        <div className="webcamwrapper">
          <video
            className="video"
            ref={this.localVideoRef}
            autoPlay
            playsInline
            muted
          />
          {numConnections.map(() => <RemoteVideo socket={socket} />) }

        </div>
      </div>
    );
  }
}
