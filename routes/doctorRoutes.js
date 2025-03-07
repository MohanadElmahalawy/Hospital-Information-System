const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/user");

const router = express.Router();

// ✅ Route to get all doctors (for patients to view)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const doctors = await User.find({ role: "Doctor" }).select(
      "firstName lastName phoneNumber expertiseLevel"
    );

    res.json(doctors);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

// ✅ Route to edit Doctor Profile
router.put("http://localhost:3000/api/patient/edit-profile", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "Doctor") {
      return res
        .status(403)
        .json({ msg: "Access denied! Only doctors can edit profile." });
    }

    const { birthDate, email, phoneNumber } = req.body;
    const doctor = await User.findById(req.user.id);
    if (!doctor) return res.status(404).json({ msg: "Doctor not found" });

    // Update only allowed fields
    if (birthDate) doctor.birthDate = birthDate;
    if (email) doctor.email = email;
    if (phoneNumber) doctor.phoneNumber = phoneNumber;

    await doctor.save();
    res.json({ msg: "Profile updated successfully", doctor });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

// ✅ Route to get all patients (for doctors to view)
router.get("/patients", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "Doctor") {
      return res
        .status(403)
        .json({ msg: "Access denied! Only doctors can view patients." });
    }

    const patients = await User.find({ role: "Patient" }).select(
      "firstName lastName age phoneNumber"
    );

    res.json(patients);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

module.exports = router;
