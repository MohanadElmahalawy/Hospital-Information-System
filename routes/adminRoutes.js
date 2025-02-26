const express = require('express');
const User = require('../models/user');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * ✅ Route: Add a new doctor (Admin only)
 */
router.post('/add-doctor', authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== 'Admin') {
            return res.status(403).json({ msg: 'Access denied' });
        }

        const { firstName, lastName, birthDate, gender, email, phoneNumber, password, expertiseLevel } = req.body;

        let existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        const newDoctor = new User({
            firstName,
            lastName,
            birthDate,
            gender,
            email,
            phoneNumber,
            password,
            role: 'Doctor',
            expertiseLevel
        });

        await newDoctor.save();
        res.status(201).json({ msg: 'Doctor added successfully', doctor: newDoctor });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

/**
 * ✅ Route: Remove a doctor (Admin only)
 */
router.delete('/remove-doctor/:id', authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== 'Admin') {
            return res.status(403).json({ msg: 'Access denied' });
        }

        const doctor = await User.findById(req.params.id);
        if (!doctor || doctor.role !== 'Doctor') {
            return res.status(404).json({ msg: 'Doctor not found' });
        }

        await User.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Doctor removed successfully' });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

/**
 * ✅ Route: Remove a patient (Admin only)
 */
router.delete('/remove-patient/:id', authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== 'Admin') {
            return res.status(403).json({ msg: 'Access denied' });
        }

        const patient = await User.findById(req.params.id);
        if (!patient || patient.role !== 'Patient') {
            return res.status(404).json({ msg: 'Patient not found' });
        }

        await User.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Patient removed successfully' });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

/**
 * ✅ Route: View all doctors and patients (Admin only)
 */
router.get('/all-users', authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== 'Admin') {
            return res.status(403).json({ msg: 'Access denied' });
        }

        const users = await User.find({ role: { $in: ['Doctor', 'Patient'] } }).select('-password');
        res.json(users);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;
