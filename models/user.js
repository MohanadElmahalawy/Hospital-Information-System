const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    birthDate: { type: Date, required: true },
    gender: { type: String, enum: ['Male', 'Female'], required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['Admin', 'Doctor', 'Patient'], required: true },
    expertiseLevel: { type: String, required: function () { return this.role === 'Doctor'; } }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;
