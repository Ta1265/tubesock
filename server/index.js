require('dotenv').config();
const axios = require('axios');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const myRooms = {
  exampleRoomName: {
    cuedVideoId: '',
    users: [{
      userName: '',
      id: '',
    }],
  },
};

io.on('connection', (socket) => {
  const { id } = socket;
  console.log('socketio connected socketid = ', id);
  let socketData = { roomName: null, userName: null };

  socket.on('join_room', ({ roomName, userName }) => {
    socketData = { roomName, userName };
    socket.join(roomName);

    if (myRooms[roomName]) {
      myRooms[roomName].users.push({ userName, id });
      socket.on('youtube-player-ready', () => {
        io.to(roomName).emit('change-video', myRooms[roomName].cuedVideoId); // send qued video to new user / reset everyone;
      });
    } else {
      myRooms[roomName] = {
        cuedVideoId: '',
        users: [{
          userName,
          id,
        }],
      };
    }
    const count = myRooms[roomName].users.length;
    io.in(roomName).emit('connection-count', count);
    io.in(roomName).emit('message', `Server - ${userName} has joined room ${roomName}, total in room= ${myRooms[roomName].users.length}`);
  });

  socket.on('message', (msg) => {
    const { roomName, userName } = socketData;
    console.log('received message from client ->', msg);
    io.in(roomName).emit('message', `${userName} says - ${msg}`);
  });

  socket.on('disconnect', (reason) => {
    const { roomName, userName } = socketData;
    if (roomName) {
      console.log(`${userName}, id ${id} has disconnection from${roomName}, ${reason}`);
      myRooms[roomName].users = myRooms[roomName].users.filter((u) => u.userName !== userName);
      console.log('users in room now -> ', myRooms[roomName]);
      io.in(roomName).emit('connection-count', myRooms[roomName].users.length);
      io.in(roomName).emit('message', `${userName} has disconnected from room ${roomName}`);
    }
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
    myRooms[roomName].cuedVideoId = message;
    io.to(roomName).emit('change-video', message); // emit to whole room to sync playback
  });
});

// const { PORT } = process.env;
const PORT = 3000;

app.use(bodyParser.json());

app.use(express.static('client/dist'));

app.get('/search-videos/:searchTerms', (req, res) => {
  const { searchTerms } = req.params;
  const { YOUTUBE_API_KEY } = process.env;
  console.log(searchTerms);
  axios({
    method: 'get',
    url: 'https://www.googleapis.com/youtube/v3/search',
    params: {
      part: 'snippet',
      q: searchTerms,
      maxResults: 5,
      key: YOUTUBE_API_KEY,
      type: 'video',
    },
  })
    .then((results) => res.send(results.data.items))
    .catch((err) => console.log(err.message));
});

server.listen(PORT, (err) => {
  if (err) return console.log('error starting express msg-', err.message);
  return console.log('Express server listening on port-', PORT);
});

// sudo iptables -A INPUT -i eth0 -p tcp --dport 80 -j ACCEPT
// sudo iptables -A INPUT -i eth0 -p tcp --dport 3000 -j ACCEPT
// sudo iptables -A PREROUTING -t nat -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 3000

// sudo iptables -A PREROUTING -t nat -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 3000
