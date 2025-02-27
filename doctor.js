const express = require('express');
const router = express.Router();
const User = require('../models/users');
const authMiddleware = require('../middleware/authMiddleware');

// Middleware to ensure the user is a doctor
const isDoctor = (req, res, next) => {
  if (req.user.role !== 'doctor') {
    return res.status(403).json({ message: 'Forbidden: Doctors only' });
  }
  next();
};

// View all patients (Doctor only)
router.get('/patients', authMiddleware, isDoctor, async (req, res) => {
  try {
    const patients = await User.find({ role: 'patient' });
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching patients', error });
  }
});

// Update doctor profile (email, phone, and birth date)
router.put('/update-profile', authMiddleware, isDoctor, async (req, res) => {
  const { birthDate, email, phoneNumber } = req.body;

  try {
    const doctor = await User.findById(req.user.userId);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

    doctor.birthDate = birthDate || doctor.birthDate;
    doctor.email = email || doctor.email;
    doctor.phoneNumber = phoneNumber || doctor.phoneNumber;

    await doctor.save();
    res.status(200).json({ message: 'Doctor profile updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating doctor profile', error });
  }
});

module.exports = router;
