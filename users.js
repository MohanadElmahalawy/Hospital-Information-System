const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  birthDate: { type: Date, required: true },
  gender: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  role: { type: String, enum: ['admin', 'doctor', 'patient'], required: true },
  password: { type: String, required: true },
  expertise: { type: String }, // For doctors only
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
