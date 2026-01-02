const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Serve static files
app.use(express.static('public'));

// Socket.io signaling
io.on('connection', socket => {
  console.log('User connected:', socket.id);

  const relay = (event) => {
    socket.on(event, data => {
      socket.broadcast.emit(event, data);
    });
  };

  relay('offer');
  relay('answer');
  relay('candidate');

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
