import React, { createRef } from 'react';
import MyRTCconnector from './myRTCconnector';
import './WebCamChat.css';

export default class WebCamChat extends React.Component {
  constructor(props) {
    super(props);
    const { socket } = props;
    this.state = {
      remoteOfferSent: false,
    };
    this.rtcConnection = new MyRTCconnector(socket);
    this.localVideoRef = createRef();
    this.remoteVideoRef = createRef();
  }

  componentDidMount() {
    this.rtcConnection.setListeners((connection, state) => {
      console.log('rtcConnection listener in room compdidmnt got connection/state=', connection, state);
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
    const { remoteOfferSent } = this.state;
    const { numConnections } = this.props;
    return (
      <div className="WebCamChatContainer">
        {remoteOfferSent === false && numConnections > 1
          ? (
            <button
              className="startVideoBtn"
              type="button"
              onClick={() => {
                this.rtcConnection.sendOffer();
                this.setState({ remoteOfferSent: true });
              }}
            >
              Enter Video Chat
            </button>
          )
          : (
            null
          )}
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
      </div>
    );
  }
}
