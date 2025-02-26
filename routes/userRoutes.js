const express = require('express');
const User = require('../models/user');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Protected route: Get all users (Only for Admin)
router.get('/all', authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== 'Admin') {
            return res.status(403).json({ msg: 'Access denied' });
        }

        const users = await User.find().select('-password'); // Exclude password field
        res.json(users);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

module.exports = router;
