require('dotenv').config();
import axios from 'axios';
import express from 'express';
import bodyParser from 'body-parser';
import YouTubeGetID from './youTubeUrlParser';

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

interface Room {
  cueVideoId: string;
  users: Array<User>;
}

interface User {
  userName: string;
  id: string;
  roomName: string;
}

interface roomMap { [keyRoomName: string]: Room; }

const roomMap: roomMap = {};

io.on('connection', (socket: any): void => {
  const { id } = socket;
  console.log('socketio connected id = ', id);
  let user: User;

  socket.on('join_room', ({ roomName, userName }: any): void => {
    user = { userName, id, roomName };
    socket.join(roomName);
    console.log(`${userName}, has joined room - ${roomName}`);
    if (roomMap[roomName]) {
      roomMap[roomName].users.push(user);
      socket.on('youtube-player-ready', () => {
        io.in(roomName).emit('change-video-id', roomMap[roomName].cueVideoId); // send qued video to new user / reset everyone;
      });
    } else {
      roomMap[roomName] = { cueVideoId: '', users: [user] };
    }
    const minusSelf = roomMap[roomName].users.filter((u) => u.id !== user.id);
    if (minusSelf.length > 0) {
      socket.emit('getuptospeed-list', minusSelf);
    }
    socket.to(roomName).emit('new-user-joined', user.id); // sends to all in room except the sender
    io.in(roomName).emit('message', `Server - ${user.userName} has joined room ${roomName}, total in room= ${roomMap[roomName].users.length}`);
  });

  socket.on('message', (msg: any) => {
    const { userName, roomName } = user;
    console.log(`Room-${roomName}, userName-${userName} received message from client ->`, msg);
    io.in(roomName).emit('message', `${userName} says - ${msg}`);
  });

  socket.on('disconnect', (reason: any) => {
    const { roomName, id, userName } = user;
    const { users } = roomMap[roomName]
    if (roomName) {
      console.log(`${userName}, id ${id} has disconnection from${roomName}, ${reason}`);
      roomMap[roomName].users = users.filter((i) => i.id !== id);
      io.in(roomName).emit('connection-count', roomMap[roomName].users.length);
      io.in(roomName).emit('message', `${userName} has disconnected from room ${roomName}`);
    }
  });

  socket.on('peer_connection_relay', (message: any, toId: any) => {
    const fromId = user.id;
    console.log('fromid', fromId, 'toId', toId);
    socket.to(toId).emit('peer_connection_relay', message, fromId); // (private message);

  });

  socket.on('youtube-sync', (message: any) => {
    const { roomName } = user;
    io.to(roomName).emit('youtube-sync', message); // emit to whole room to sync playback
  });
  socket.on('change-video-id', (message: string) => {
    const { roomName } = user;
    roomMap[roomName].cueVideoId = message;
    io.to(roomName).emit('change-video-id', message); // emit to whole room to sync playback
  });
  socket.on('change-video-url', (message: any) => {
    const { roomName } = user;
    roomMap[roomName].cueVideoId = YouTubeGetID(message);
    io.to(roomName).emit('change-video-id', roomMap[roomName].cueVideoId); // emit to whole room to sync playback
  });
});

// const { PORT } = process.env;
const PORT: number = 3000;

app.use(bodyParser.json());

app.use(express.static('client/dist'));

app.get('/search-videos/:searchTerms', (req: any, res: any) => {

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

server.listen(PORT, (err: Error) => {
  if (err) return console.log('error starting express msg-', err.message);
  return console.log('Express server listening on port-', PORT);
});
