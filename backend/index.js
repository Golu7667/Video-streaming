const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  pingTimeout: 60000,
  cors: {
    // origin: "https://chat-app-two-pi-40.vercel.app",
    origin:"https://webrtc-brown.vercel.app",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  },
});

const connectedUsers = {};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join', (roomId, userId) => {
    socket.join(roomId);
    connectedUsers[userId] = socket.id;
    console.log(roomId,userId)
    // Notify the user about the other user joining the call
    socket.to(roomId).emit('user-joined', userId);
  });

  socket.on('offer', (offer, targetUserId) => {
    const targetSocketId = connectedUsers[targetUserId];
    io.to(targetSocketId).emit('offer', offer, socket.id);
  });

  socket.on('answer', (answer, targetUserId) => {
    const targetSocketId = connectedUsers[targetUserId];
    io.to(targetSocketId).emit('answer', answer);
  });

  socket.on('ice-candidate', (candidate, targetUserId) => {
    const targetSocketId = connectedUsers[targetUserId];
    io.to(targetSocketId).emit('ice-candidate', candidate);
  });

  socket.on('disconnect', () => {
    handleUserDisconnect(socket.id);
  });
});

function handleUserDisconnect(socketId) {
  const disconnectedUserId = Object.keys(connectedUsers).find(
    userId => connectedUsers[userId] === socketId
  );

  if (disconnectedUserId) {
    delete connectedUsers[disconnectedUserId];
    io.emit('user-disconnected', disconnectedUserId);
    console.log('User disconnected:', disconnectedUserId);
  }
}

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
