import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Middleware to protect routes by verifying JWT token
export const protect = async (req, res, next) => {
  // Get token from Authorization header (if it exists)
  let token = req.headers.authorization?.split(' ')[1];

  // If no token is provided
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    // Verify the token using the JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user by ID and exclude the password field
    req.user = await User.findById(decoded.id).select('-password');

    // If user not found in database
    if (!req.user) throw new Error('User not found');

    // Continue to next middleware or route
    next();
  } catch (err) {
    // If token is invalid or verification fails
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};
