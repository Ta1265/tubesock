interface Message {
  offer: RTCSessionDescription | undefined;
  answer: RTCSessionDescription | undefined;
  iceCandidate: RTCIceCandidate | undefined;
}

export default class MyRTCconnector {
  private configuration: RTCConfiguration;

  private peerConnection: RTCPeerConnection;

  constructor(
    private socket: SocketIOClient.Socket,
    private toId: string,
    private disconnectCallBack: (id: string) => void,
  ) {
    this.configuration = {
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    };
    this.peerConnection = new RTCPeerConnection(this.configuration);

    this.peerConnection.addEventListener(
      'icecandidate',
      this.handleIceCandidate.bind(this),
    );
    this.peerConnection.addEventListener(
      'connectionstatechange',
      this.handleConState.bind(this),
    );
  }

  contactWasInitiated(): boolean {
    if (this.peerConnection.remoteDescription === null) return false;
    return true;
  }

  handleMessage(message: Message): void {
    if (message.answer) {
      const remoteDesc = new RTCSessionDescription(message.answer);
      this.peerConnection
        .setRemoteDescription(remoteDesc)
        .catch((error: Error) => console.error(error.message));
    }
    if (message.offer) {
      console.log('got offer');
      this.peerConnection.setRemoteDescription(new RTCSessionDescription(message.offer));
      this.addLocalMediaStream()
        .then(() => this.peerConnection.createAnswer())
        .then((answer) => {
          this.peerConnection.setLocalDescription(answer)
            .then(() => this.socket.emit('peer_connection_relay', { answer }, this.toId));
        })
        .catch((err) => console.error('err receiving con ', err.message));
    }
    if (message.iceCandidate) {
      this.peerConnection
        .addIceCandidate(message.iceCandidate)
        .catch((err) => console.error('Error adding received ice candidate', err));
    }
  }

  handleIceCandidate(event: RTCPeerConnectionIceEvent): void {
    if (event.candidate) {
      this.socket.emit(
        'peer_connection_relay',
        { iceCandidate: event.candidate },
        this.toId,
      );
    }
  }

  handleConState(): void {
    const { connectionState } = this.peerConnection;
    if (connectionState === 'connected') console.log('connected to peer id');
    if (connectionState === 'disconnected') this.disconnectCallBack(this.toId);
    if (connectionState === 'failed') this.disconnectCallBack(this.toId);
  }

  setRemoteMediaListener(callback: (stream: MediaStream) => void): void {
    this.peerConnection.addEventListener('track', (event): void => {
      const stream = new MediaStream();
      stream.addTrack(event.track);
      callback(stream);
    });
  }

  sendOffer(): void {
    this.addLocalMediaStream()
      .then(() => this.peerConnection.createOffer()
        .then((offer) => {
          this.peerConnection.setLocalDescription(offer)
            .then(() => this.socket.emit('peer_connection_relay', { offer }, this.toId));
        })
        .catch((err) => console.error('error createConnection', err.message)));
  }

  addLocalMediaStream(): Promise<unknown> {
    return new Promise((resolve, reject) => {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((localStream) => {
          localStream.getTracks().forEach((track) => {
            this.peerConnection.addTrack(track, localStream);
            resolve('success');
          });
        })
        .catch((err) => reject(err));
    });
  }
}
