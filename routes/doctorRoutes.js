const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/user");

const router = express.Router();

// Edit Doctor Profile
router.put("/edit-profile", authMiddleware, async (req, res) => {
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
