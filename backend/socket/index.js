// const socketIo = (io, User, ChatRoom, Message) => {
//     // Handle a user connecting
//     io.on('connection', (socket) => {
//       console.log(`🔌 User connected: ${socket.id}`);
  
//       // Handle user joining a room
//       socket.on('joinRoom', async (roomId, userId) => {
//         const user = await User.findById(userId);
//         if (user) {
//           socket.join(roomId);
//           console.log(`${user.username} joined room ${roomId}`);
  
//           // Emit message about the user joining
//           socket.to(roomId).emit('userJoined', `${user.username} has joined the chat!`);
//         }
//       });
  
//       // Handle sending a message
//       socket.on('sendMessage', async (data) => {
//         const { content, chatRoomId, senderId } = data;
  
//         // Create message in the database
//         const message = await Message.create({
//           sender: senderId,
//           content,
//           chatRoom: chatRoomId,
//         });

//         // Populate the message
//         const populatedMessage = await message.populate('sender', 'username');
  
//         // Update the latest message for the chat room
//         await ChatRoom.findByIdAndUpdate(chatRoomId, { latestMessage: populatedMessage._id });
//         // await ChatRoom.findByIdAndUpdate(chatRoomId, { latestMessage: message._id });
  
//         // Emit message to the room
//         // io.to(chatRoomId).emit('receiveMessage', {
//         //   content: message.content,
//         //   senderId: message.sender,
//         //   createdAt: message.createdAt,
//         // });

//         io.to(chatRoomId).emit('receiveMessage', populatedMessage);

//       });
  
//       // Handle user disconnecting
//       socket.on('disconnect', () => {
//         console.log(`❌ User disconnected: ${socket.id}`);
//       });
//     });
//   };
  
//   module.exports = socketIo;
  

const socketIo = (io, User, ChatRoom, Message) => {
  io.on('connection', (socket) => {
    console.log(`🔌 User connected: ${socket.id}`);

    socket.on('joinRoom', async (roomId, userId) => {
      const user = await User.findById(userId);
      if (user) {
        socket.join(roomId);
        console.log(`${user.username} joined room ${roomId}`);

        socket.to(roomId).emit('userJoined', `${user.username} has joined the chat!`);
      }
    });

    socket.on('sendMessage', async (data) => {
      const { content, chatRoomId, senderId } = data;

      // Create message in DB
      const message = await Message.create({
        sender: senderId,
        content,
        chatRoom: chatRoomId,
      });

      // Update latest message in chat room
      await ChatRoom.findByIdAndUpdate(chatRoomId, { latestMessage: message._id });

      // Populate sender before emitting
      const populatedMessage = await message.populate('sender', 'username');

      // Emit full message to room with sender username
      io.to(chatRoomId).emit('receiveMessage', populatedMessage);
    });

    socket.on('disconnect', () => {
      console.log(`❌ User disconnected: ${socket.id}`);
    });
  });
};

module.exports = socketIo;
