const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Auction = require('../models/Auction');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/create-admin', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    user = await User.create({
      name,
      email,
      password,
      role: 'admin'
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      message: 'Admin created successfully'
    });
  } catch (error) {
    console.error('Create Admin Error:', error);
    res.status(500).json({ message: 'Server error creating admin', error: error.message });
  }
});

router.get('/users', protect, admin, async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    console.error('Admin Users Error:', error);
    res.status(500).json({ message: 'Server error fetching users', error: error.message });
  }
});

router.delete('/auction/:id', protect, admin, async (req, res) => {
  try {
    const auction = await Auction.findByIdAndDelete(req.params.id);
    if (!auction) {
      return res.status(404).json({ message: 'Auction not found' });
    }
    res.json({ message: 'Auction removed successfully' });
  } catch (error) {
    console.error('Admin Delete Auction Error:', error);
    res.status(500).json({ message: 'Server error deleting auction', error: error.message });
  }
});

module.exports = router;
