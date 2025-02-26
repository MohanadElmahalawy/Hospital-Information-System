const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/user");

const router = express.Router();

// Edit Patient Profile
router.put("/edit-profile", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "Patient") {
            return res.status(403).json({ msg: "Access denied! Only patients can edit profile." });
        }

        const { firstName, lastName, birthDate, email, phoneNumber } = req.body;

        const patient = await User.findById(req.user.id);
        if (!patient) return res.status(404).json({ msg: "Patient not found" });

        // Patients can edit everything except gender
        if (firstName) patient.firstName = firstName;
        if (lastName) patient.lastName = lastName;
        if (birthDate) patient.birthDate = birthDate;
        if (email) patient.email = email;
        if (phoneNumber) patient.phoneNumber = phoneNumber;
        
        await patient.save();
        res.json({ msg: "Profile updated successfully", patient });

    } catch (error) {
        res.status(500).json({ msg: "Server error", error: error.message });
    }
});
router.get("/doctors", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "Patient") {
            return res.status(403).json({ msg: "Access denied! Only patients can view doctors." });
        }

        const doctors = await User.find({ role: "Doctor" }).select("firstName lastName phoneNumber expertiseLevel");

        res.json(doctors);
    } catch (error) {
        res.status(500).json({ msg: "Server error", error: error.message });
    }
});


module.exports = router;
