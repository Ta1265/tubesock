require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

io.on('connection', (socket) => {
  const { id } = socket;
  console.log('socketio connected socketid = ', id);
  let socketData = { roomName: null, userName: null };

  socket.on('join_room', ({ roomName, userName }) => {
    socketData = { roomName, userName };
    socket.join(roomName);
    io.in(roomName).emit('message', `${userName} has joined room ${roomName}`);
  });

  socket.on('message', (msg) => {
    const { roomName, userName } = socketData;
    console.log('received message from client ->', msg);
    io.in(roomName).emit('message', `${userName} says - ${msg}`);
  });

  socket.on('disconnect', (reason) => {
    const { roomName, userName } = socketData;
    console.log(`${userName}, id ${id} has disconnection from${roomName}, ${reason}`);
    io.in(roomName).emit('message', `${userName} has disconnected from room ${roomName}`);
  });
});

const { PORT } = process.env;

app.use(bodyParser.json());

app.use(express.static('client/dist'));

server.listen(3027, (err) => {
  if (err) return console.log('error starting express msg-', err.message);
  return console.log('Express server listening on port-', PORT);
});
