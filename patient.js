const express = require('express');
const router = express.Router();
const User = require('../models/users');
const authMiddleware = require('../middleware/authMiddleware');
const isDoctor = require('../middleware/isDoctor'); 

// Middleware to ensure the user is a patient
const isPatient = (req, res, next) => {
  if (req.user.role !== 'patient') {
    return res.status(403).json({ message: 'Forbidden: Patients only' });
  }
  next();
};

// View all doctors (Patient only)
router.get('/doctors', authMiddleware, isPatient, async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' });
    const doctorInfo = doctors.map(doctor => ({
      name: `${doctor.firstName} ${doctor.lastName}`,
      phoneNumber: doctor.phoneNumber
    }));
    res.json(doctorInfo);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching doctors', error });
  }
});

// Update patient profile (name, birth date, email, phone number, but not gender)
router.put('/update-profile', authMiddleware, isPatient, async (req, res) => {
  const { firstName, lastName, birthDate, email, phoneNumber } = req.body;

  try {
    const patient = await User.findById(req.user.userId);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    patient.firstName = firstName || patient.firstName;
    patient.lastName = lastName || patient.lastName;
    patient.birthDate = birthDate || patient.birthDate;
    patient.email = email || patient.email;
    patient.phoneNumber = phoneNumber || patient.phoneNumber;

    await patient.save();
    res.status(200).json({ message: 'Patient profile updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating patient profile', error });
  }
});

// Example: Route that requires authentication (for doctors only)
router.get('/patients', authMiddleware, isDoctor, async (req, res) => {
  // Only authenticated doctors will be able to access this route
});

module.exports = router;
