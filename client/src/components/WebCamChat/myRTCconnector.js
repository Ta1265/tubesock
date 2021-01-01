export default class MyRTCconnector {
  constructor(socket) {
    this.socket = socket;
    this.configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
    this.peerConnection = new RTCPeerConnection(this.configuration);
  }

  setListeners(disconnectCallback) {
    this.socket.on('webcam_con', (message) => {
      if (message.answer) {
        console.log('received answer');
        const remoteDesc = new RTCSessionDescription(message.answer);
        this.peerConnection.setRemoteDescription(remoteDesc);
      }
      if (message.offer) {
        console.log('received connection offer');
        this.peerConnection.setRemoteDescription(new RTCSessionDescription(message.offer));

        this.addLocalMediaStream()
          .then(() => this.peerConnection.createAnswer())
          .then((answer) => {
            this.peerConnection.setLocalDescription(answer)
              .then(() => this.socket.emit('webcam_con', { answer }));
          })
          .catch((err) => console.log('err receiving con ', err.message));
      }
      if (message.iceCandidate) {
        this.peerConnection.addIceCandidate(message.iceCandidate)
          .catch((err) => console.log('Error adding received ice candidate', err));
      }
    });

    this.peerConnection.addEventListener('icecandidate', (event) => {
      if (event.candidate) {
        console.log('found new ice candidate');
        this.socket.emit('webcam_con', { iceCandidate: event.candidate });
      }
    });

    this.peerConnection.addEventListener('connectionstatechange', (event) => {
      const { connectionState } = this.peerConnection;
      if (connectionState === 'connected') {
        console.log('connected to peer', event);
      }
      if (connectionState === 'disconnected') {
        console.log('peer disconnected');
        disconnectCallback();
      }
      if (connectionState === 'failed') {
        console.log('peer disconnected');
        disconnectCallback();
      }
    });
  }

  setRemoteMediaListener(callback) {
    this.peerConnection.addEventListener('track', (event) => {
      console.log('setRemoteMediaListener triggered');
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
            .then(() => this.socket.emit('webcam_con', { offer }));
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
