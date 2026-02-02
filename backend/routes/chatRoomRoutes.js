const express = require('express');
const router = express.Router();
const { createChatRoom, getChatRooms } = require('../controllers/chatRoomController');
const { protect } = require('../middleware/authMiddleware');

// Create new chat room
router.post('/',protect, createChatRoom);

// Get all chat rooms for the user
router.get('/',protect, getChatRooms);

// Apply middleware to routes
// router.post('/', protect, sendMessage);
// router.get('/:chatRoomId', protect, getMessages);

module.exports = router;
