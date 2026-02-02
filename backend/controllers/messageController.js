const Message = require('../models/Message');
const ChatRoom = require('../models/ChatRoom');

// @desc Send a new message
// @route POST /api/messages
const sendMessage = async (req, res) => {
  const { content, chatRoomId } = req.body;
  const senderId = req.user.id;  // Assuming authentication middleware sets req.user

  try {
    const chatRoom = await ChatRoom.findById(chatRoomId);
    if (!chatRoom) {
      return res.status(404).json({ message: 'Chat room not found' });
    }

    const message = await Message.create({
      sender: senderId,
      content,
      chatRoom: chatRoomId,
    });

    // Update chat room's latest message
    chatRoom.latestMessage = message._id;
    await chatRoom.save();

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Get messages in a chat room
// @route GET /api/messages/:chatRoomId
const getMessages = async (req, res) => {
  const { chatRoomId } = req.params;

  try {
    const messages = await Message.find({ chatRoom: chatRoomId })
      .populate('sender', 'username')
      .sort({ createdAt: 1 });  // Sort by creation date (oldest first)

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { sendMessage, getMessages };
