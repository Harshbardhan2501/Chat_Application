const socketIo = (io, User, ChatRoom, Message) => {
    // Handle a user connecting
    io.on('connection', (socket) => {
      console.log(`🔌 User connected: ${socket.id}`);
  
      // Handle user joining a room
      socket.on('joinRoom', async (roomId, userId) => {
        const user = await User.findById(userId);
        if (user) {
          socket.join(roomId);
          console.log(`${user.username} joined room ${roomId}`);
  
          // Emit message about the user joining
          socket.to(roomId).emit('userJoined', `${user.username} has joined the chat!`);
        }
      });
  
      // Handle sending a message
      socket.on('sendMessage', async (data) => {
        const { content, chatRoomId, senderId } = data;
  
        // Create message in the database
        const message = await Message.create({
          sender: senderId,
          content,
          chatRoom: chatRoomId,
        });
  
        // Update the latest message for the chat room
        await ChatRoom.findByIdAndUpdate(chatRoomId, { latestMessage: message._id });
  
        // Emit message to the room
        io.to(chatRoomId).emit('receiveMessage', {
          content: message.content,
          senderId: message.sender,
          createdAt: message.createdAt,
        });
      });
  
      // Handle user disconnecting
      socket.on('disconnect', () => {
        console.log(`❌ User disconnected: ${socket.id}`);
      });
    });
  };
  
  module.exports = socketIo;
  