export default class MyRTCconnector {
  constructor(socket, toId, disconnectCallBack) {
    this.toId = toId;
    this.socket = socket;
    this.disconnectCallBack = disconnectCallBack;
    this.configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
    this.peerConnection = new RTCPeerConnection(this.configuration);

    this.peerConnection.addEventListener('icecandidate', this.handleIceCandidate.bind(this));
    this.peerConnection.addEventListener('connectionstatechange', this.handleConState.bind(this));
  }

  contactWasInitiated() {
    if (this.peerConnection.localDescription === null) return false;
    return true;
  }

  handleMessage(message) {
    if (message.answer) {
      console.log('answer received from toId', this.toId);
      const remoteDesc = new RTCSessionDescription(message.answer);
      this.peerConnection.setRemoteDescription(remoteDesc);
    }
    if (message.offer) {
      this.peerConnection.setRemoteDescription(new RTCSessionDescription(message.offer));
      this.addLocalMediaStream()
        .then(() => this.peerConnection.createAnswer())
        .then((answer) => {
          this.peerConnection.setLocalDescription(answer)
            .then(() => this.socket.emit('peer_connection_relay', { answer }, this.toId));
        })
        .catch((err) => console.log('err receiving con ', err.message));
    }
    if (message.iceCandidate) {
      this.peerConnection.addIceCandidate(message.iceCandidate)
        .catch((err) => console.log('Error adding received ice candidate', err));
    }
  }

  handleIceCandidate(event) {
    if (event.candidate) {
      this.socket.emit('peer_connection_relay', { iceCandidate: event.candidate }, this.toId);
    }
  }

  handleConState() {
    const { connectionState } = this.peerConnection;
    if (connectionState === 'connected') console.log('connected to peer id=', this.toId);
    if (connectionState === 'disconnected') this.disconnectCallBack(this.toId);
    if (connectionState === 'failed') this.disconnectCallBack(this.toId);
  }

  setRemoteMediaListener(callback) {
    this.peerConnection.addEventListener('track', (event) => {
      const stream = new MediaStream();
      stream.addTrack(event.track, stream);
      callback(stream);
    });
  }

  sendOffer() {
    this.addLocalMediaStream()
      .then(() => this.peerConnection.createOffer()
        .then((offer) => {
          this.peerConnection.setLocalDescription(offer)
            .then(() => this.socket.emit('peer_connection_relay', { offer }, this.toId))
            .then(() => console.log('offer sent to id-', this.toId));
        })
        .catch((err) => console.log('error createConnection', err.message)));
  }

  addLocalMediaStream() {
    return new Promise((resolve, reject) => {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((localStream) => {
          localStream.getTracks().forEach((track) => {
            this.peerConnection.addTrack(track, localStream);
            resolve();
          });
        })
        .catch((err) => reject(err));
    });
  }
}
