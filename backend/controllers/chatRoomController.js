const ChatRoom = require('../models/ChatRoom');
const User = require('../models/User');

// @desc Create a new chat room
// @route POST /api/chatrooms
const createChatRoom = async (req, res) => {
  const { name, isGroupChat, userIds } = req.body;

  try {
    // Add the current user to the users array
    const user = req.user.id;  // Assuming authentication middleware sets req.user
    // const users = [user, ...userIds];
    const users = userIds ? [user, ...userIds] : [user];

    const chatRoom = await ChatRoom.create({ name, isGroupChat, users });

    res.status(201).json(chatRoom);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Get all chat rooms for a user
// @route GET /api/chatrooms
const getChatRooms = async (req, res) => {
  try {
    const chatRooms = await ChatRoom.find({ users: req.user.id })
      .populate('users', 'username')
      .populate('latestMessage');

    res.json(chatRooms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createChatRoom, getChatRooms };
