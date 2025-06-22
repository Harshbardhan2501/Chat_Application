const User = require('../models/User');

// @desc    Search users by username
// @route   GET /api/users/search?query=abc
// @access  Private
const searchUsers = async (req, res) => {
  const query = req.query.query;

  try {
    const users = await User.find({
      username: { $regex: query, $options: 'i' },
      _id: { $ne: req.user.id }, // exclude self
    }).select('_id username');

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { searchUsers };
