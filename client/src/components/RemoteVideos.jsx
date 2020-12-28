import React, { createRef } from 'react';

export default class RemoteVideos extends React.Component {
  constructor(props) {
    super(props);
    this.remoteVideoRef = createRef();
  }

  componentDidMount() {
    console.log('??');
    const { remoteStream } = this.props;
    console.log(remoteStream);
    this.remoteVideoRef.current.srcObject = remoteStream;
    console.log(this.remoteVideoRef.current.srcObject);
  }

  render() {
    console.log(this.remoteVideoRef.current);
    return (
      <video
        ref={this.remoteVideoRef.current}
        autoPlay
        playsInline
        muted
        onCanPlay={() => (this.remoteVideoRef.current.play())}
      />
    );
  }
}
