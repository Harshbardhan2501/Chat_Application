const express = require('express');
const router = express.Router();
const { sendMessage, getMessages } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

// Send message
router.post('/', sendMessage);

// Get messages for a chat room
router.get('/:chatRoomId', getMessages);

// Apply middleware to routes
router.post('/', protect, sendMessage);
router.get('/:chatRoomId', protect, getMessages);

module.exports = router;
