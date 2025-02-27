const express = require('express');
const router = express.Router();
const User = require('../models/users');
const authMiddleware = require('../middleware/authMiddlewaredleware');
const isDoctor = require('../middleware/isDoctor'); 

// Middleware to ensure the user is an admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: Admins only' });
  }
  next();
};

// View all doctors and patients
router.get('/users', authMiddleware, isAdmin, async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
});

// Add a doctor
router.post('/add-doctor', authMiddleware, isAdmin, async (req, res) => {
  const { firstName, lastName, birthDate, gender, email, phoneNumber, expertise, password } = req.body;

  try {
    const existingDoctor = await User.findOne({ email });
    if (existingDoctor) return res.status(400).json({ message: 'Doctor already exists' });

    const newDoctor = new User({
      firstName,
      lastName,
      birthDate,
      gender,
      email,
      phoneNumber,
      expertise,
      password, // Don't forget to hash the password before saving (use bcrypt)
      role: 'doctor',
    });

    await newDoctor.save();
    res.status(201).json({ message: 'Doctor added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding doctor', error });
  }
});

// Retire a doctor
router.delete('/retire-doctor/:id', authMiddleware, isAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const doctor = await User.findById(id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

    if (doctor.role !== 'doctor') return res.status(400).json({ message: 'This user is not a doctor' });

    await doctor.remove();
    res.status(200).json({ message: 'Doctor retired successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error retiring doctor', error });
  }
});

// Remove a patient
router.delete('/remove-patient/:id', authMiddleware, isAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const patient = await User.findById(id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    if (patient.role !== 'patient') return res.status(400).json({ message: 'This user is not a patient' });

    await patient.remove();
    res.status(200).json({ message: 'Patient removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing patient', error });
  }
});
// const authMiddleware = require('../middleware/authMiddlewaredleware');

// Example: Route that requires authentication (for doctors only)
router.get('/patients', authmid, isDoctor, async (req, res) => {
  // Only authenticated doctors will be able to access this route
});

module.exports = router;
