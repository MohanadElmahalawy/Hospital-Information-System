// middleware/isDoctor.js
module.exports = (req, res, next) => {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ message: 'Access denied. You must be a doctor.' });
    }
    next(); // Proceed to the next middleware or route handler
  };