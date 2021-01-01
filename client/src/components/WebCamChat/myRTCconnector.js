export default class MyRTCconnector {
  constructor(socket) {
    this.socket = socket;
    this.configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
    this.peerConnection = new RTCPeerConnection(this.configuration);

    this.remoteConnections = {};
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
        let answer;
        this.peerConnection.createAnswer()
          .then((ans) => {
            answer = ans;
            return this.peerConnection.setLocalDescription(answer);
          })
          .then(() => this.socket.emit('webcam_con', { answer }))
          .catch((err) => console.log('err receiving con ', err.message));
      }
      if (message.iceCandidate) {
        console.log('received ice candidate');
        this.peerConnection.addIceCandidate(message.iceCandidate)
          .catch((err) => console.log('Error adding received ice candidate', err));
      }
    });

    this.peerConnection.addEventListener('icecandidate', (event) => {
      if (event.candidate) {
        console.log('found new ice candidate');
        this.socket.emit('webcam_con', { 'new-ice-candidate': event.candidate });
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
      // this.remoteVideoRef.current.srcObject = stream;
      // console.log(this.remoteVideoRef.current.srcObject);
    });
  }

  sendOffer() {
    let offer;
    this.peerConnection.createOffer()
      .then((off) => {
        offer = off;
        return this.peerConnection.setLocalDescription(offer);
      })
      .then(() => this.socket.emit('webcam_con', { offer }))
      .catch((err) => console.log('error createConnection', err.message));
  }

  addLocalMediaStream(callback) {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((localStream) => {
        localStream.getTracks().forEach((track) => {
          this.peerConnection.addTrack(track, localStream);
        });
        return localStream;
      })
      .then((localStream) => callback(localStream))
      .catch((err) => console.log('error adding local media stream', err));
  }
}