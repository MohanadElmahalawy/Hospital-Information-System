const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    const token = authHeader.split(" ")[1]; // Extract the token

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach the user payload to the request
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Invalid token , access denied' });
    }
};

module.exports = authMiddleware;
