require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const myRooms = {};

io.on('connection', (socket) => {
  const { id } = socket;
  console.log('socketio connected socketid = ', id);
  let socketData = { roomName: null, userName: null };

  socket.on('join_room', ({ roomName, userName }) => {
    socketData = { roomName, userName };
    socket.join(roomName);
    if (myRooms[roomName]) {
      myRooms[roomName] += 1;
    } else {
      myRooms[roomName] = 1;
    }
    const count = myRooms[roomName];
    console.log('new connection count =', count);
    io.in(roomName).emit('connection-count', count);
    io.in(roomName).emit('message', `${userName} has joined room ${roomName}, total in room= ${myRooms[roomName]}`);
  });

  socket.on('message', (msg) => {
    const { roomName, userName } = socketData;
    console.log('received message from client ->', msg);
    io.in(roomName).emit('message', `${userName} says - ${msg}`);
  });

  socket.on('disconnect', (reason) => {
    const { roomName, userName } = socketData;
    console.log(`${userName}, id ${id} has disconnection from${roomName}, ${reason}`);
    myRooms[roomName] -= 1;
    const count = myRooms[roomName];
    io.in(roomName).emit('connection-count', count);
    io.in(roomName).emit('message', `${userName} has disconnected from room ${roomName}`);
  });

  // relay connection messages from clients to eachother
  socket.on('webcam_con', (message) => {
    const { roomName } = socketData;
    console.log('relaying webcam_con message', message);
    socket.to(roomName).emit('webcam_con', message); // sends to all in room except the sender
    // io.to(roomName).emit('webcam_con', message); // sends to all including sender
  });
  socket.on('youtube-sync', (message) => {
    const { roomName } = socketData;
    io.to(roomName).emit('youtube-sync', message); // emit to whole room to sync playback
  });
  socket.on('change-video', (message) => {
    const { roomName } = socketData;
    io.to(roomName).emit('change-video', message); // emit to whole room to sync playback
  });
});

// const { PORT } = process.env;
const PORT = 3000;

app.use(bodyParser.json());

app.use(express.static('client/dist'));

server.listen(PORT, (err) => {
  if (err) return console.log('error starting express msg-', err.message);
  return console.log('Express server listening on port-', PORT);
});
