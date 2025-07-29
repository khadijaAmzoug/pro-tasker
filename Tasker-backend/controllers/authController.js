import User from '../models/User.js'
import generateToken from '../utils/generateToken.js'

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body

  // Check if the user already exists
  const userExists = await User.findOne({ email })
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' })
  }

  // Create new user in the database
  const user = await User.create({ name, email, password })

  // If user created successfully, return user data + token
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id), // JWT token
    })
  } else {
    // If creation failed
    res.status(400).json({ message: 'Invalid user data' })
  }
}
// @desc    Authenticate user and return token
// @route   POST /api/users/login
// @access  Public
export const loginUser = async (req, res) => {
  const { email, password } = req.body

  // Find user by email
  const user = await User.findOne({ email })

  // Check if user exists and password matches
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    })
  } else {
    // If email or password is incorrect
    res.status(401).json({ message: 'Invalid email or password' })
  }
}
