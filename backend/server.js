// const connectDB = require('./config/db');

// const authRoutes = require('./routes/authRoutes');
// const messageRoutes = require('./routes/messageRoutes');
// const chatRoomRoutes = require('./routes/chatRoomRoutes');

// const express = require('express');
// const http = require('http');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const { Server } = require('socket.io');

// dotenv.config();
// connectDB();

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: '*',
//     methods: ['GET', 'POST']
//   }
// });

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use('/api/auth', authRoutes);
// app.use('/api/messages', messageRoutes);
// app.use('/api/chatrooms', chatRoomRoutes);

// // Root Test Route
// app.get('/', (req, res) => {
//   res.send('Chat backend running...');
// });

// // Socket.IO Placeholder
// io.on('connection', (socket) => {
//   console.log(`🔌 New client: ${socket.id}`);
  
//   socket.on('disconnect', () => {
//     console.log(`❌ Disconnected: ${socket.id}`);
//   });
// });

// // Start Server
// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const messageRoutes = require('./routes/messageRoutes');
const chatRoomRoutes = require('./routes/chatRoomRoutes');

// Models (we'll need them for socket logic)
const User = require('./models/User');
const Message = require('./models/Message');
const ChatRoom = require('./models/ChatRoom');

// Load env variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Create express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/chatrooms', chatRoomRoutes);

// Create HTTP server instead of app.listen()
const server = http.createServer(app);

// Create Socket.IO server
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Import and run socket setup
const socketIo = require('./socket');
socketIo(io, User, ChatRoom, Message);

// Start the HTTP + Socket.IO server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
