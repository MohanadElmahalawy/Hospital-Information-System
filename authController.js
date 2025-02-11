const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

exports.signupPatient = [
  // Validation rules for input fields
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Please provide a valid email address'),
  body('phoneNumber').isMobilePhone().withMessage('Please provide a valid phone number'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),

  // Handle request after validation
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); // Return errors if validation fails
    }

    // Proceed with user creation (if validation is successful)
    const { firstName, lastName, email, phoneNumber, password } = req.body;

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ message: 'User already exists' });

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        firstName,
        lastName,
        email,
        phoneNumber,
        password: hashedPassword,
        role: 'patient',
      });

      await newUser.save();
      res.status(201).json({ message: 'Patient signed up successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error signing up patient', error });
    }
  }
];

// Signup for patients
exports.signupPatient = async (req, res) => {
  const { firstName, lastName, birthDate, gender, email, phoneNumber, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      birthDate,
      gender,
      email,
      phoneNumber,
      password: hashedPassword,
      role: 'patient',
    });

    await newUser.save();
    res.status(201).json({ message: 'Patient signed up successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error signing up patient', error });
  }
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
};
