export default function CreateConnection(socket) {
  // Note - use google stun server to expose your IP / ICE routes to be sent back to the server
  // stun is not an intermediary like TURN

  const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
  const peerConnection = new RTCPeerConnection(configuration);
  // setup socket listeners
  // listen for requests to connect over socket
  socket.on('webcam_con', (message) => {
    if (message.answer) {
      console.log('received answer');
      const remoteDesc = new RTCSessionDescription(message.answer);
      peerConnection.setRemoteDescription(remoteDesc);
    }
    if (message.offer) {
      console.log('received connection offer');
      peerConnection.setRemoteDescription(new RTCSessionDescription(message.offer));
      let answer;
      peerConnection.createAnswer()
        .then((ans) => {
          answer = ans;
          return peerConnection.setLocalDescription(answer);
        })
        .then(() => socket.emit('webcam_con', { answer }))
        .catch((err) => console.log('err receiving con ', err.message));
    }
    if (message.iceCandidate) {
      console.log('received ice candidate');
      peerConnection.addIceCandidate(message.iceCandidate)
        .catch((err) => console.log('Error adding received ice candidate', err));
    }
  });

  // setup RTC connection listeners
  // listen for events over the peerConnection
  peerConnection.addEventListener('icecandidate', (event) => {
    if (event.candidate) {
      console.log('found new ice candidate');
      socket.emit('webcam_con', { 'new-ice-candidate': event.candidate });
    }
  });

  peerConnection.addEventListener('connectionstatechange', (event) => {
    if (peerConnection.connectionState === 'connected') {
      console.log('connected to peer', event);
    }
  });

  return peerConnection;
}
