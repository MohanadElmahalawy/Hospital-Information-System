const express = require('express');
const router = express.Router();
const { signupPatient, login } = require('../controllers/authController');

router.post('/signup', signupPatient);
router.post('/login', login);
const authMiddleware = require('../middleware/authMiddleware');

// Example: Route that requires authentication (for doctors only)
router.get('/patients', authMiddleware, isDoctor, async (req, res) => {
  // Only authenticated doctors will be able to access this route
});

module.exports = router;
