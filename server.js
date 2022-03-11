const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
//const formatMessage = require('./util/message');
const { formatmsg ,location } = require('./util/message');
const {join, getuser,left,userroom} = require('./util/user');

// Create the Express app
const app = express();
// Create  HTTP server using the Express application
const server = http.createServer(app);
// Connect socket.io to the HTTP server
const io = socketio(server);

// Define static folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'Chat App';

// Run when client connects
//It is used for for new connections to Socket.io
io.on('connection', socket => {
  socket.on('joinRoom', ({ username, room }) => {
    const user = join(socket.id, username, room);

    socket.join(user.room);

    // Welcome current user
    socket.emit('message', formatmsg(botName, 'Welcome to Chat App'));

    // Broadcast when a user connects
    //it is used to send a message to all other users.

    socket.broadcast.to(user.room).emit('message',formatmsg(botName, `${user.username} has joined the chat`));

    // Send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: userroom(user.room)
    });
  });

  // Listen for chatMessage
  socket.on('chatMessage', msg => {
    const user = getuser(socket.id);

    io.to(user.room).emit('message', formatmsg(user.username,msg));
  });

 //for location
 socket.on('location', (coords) => {
  // console.log(coords.lat)
  const user = getuser(socket.id);

  io.to(user.room).emit('locationmessage', location(user.username, coords.lat, coords.lng))
});

  // Runs when client disconnects
  socket.on('disconnect', () => {
    const user = left(socket.id);

    if (user) {
      io.to(user.room).emit(
        'message',
        formatmsg(botName, `${user.username} has left the chat`)
      );

      // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: userroom(user.room)
      });
    }
  });
})

server.listen(3009,console.log('server running on port 3009'));
