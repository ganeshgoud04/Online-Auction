const express = require('express');
const router = express.Router();
const { registerUser, authUser, getUserProfile, addBalance } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', authUser);
router.get('/profile', protect, getUserProfile);
router.put('/profile/add-money', protect, addBalance);

module.exports = router;
