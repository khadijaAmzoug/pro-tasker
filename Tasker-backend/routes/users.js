import express from 'express'
import { registerUser, loginUser } from '../controllers/authController.js'

const router = express.Router()

// @route   POST /api/users/register
// @desc    Register a new user
// @access  Public
router.post('/register', registerUser)

// @route   POST /api/users/login
// @desc    Login user and return token
// @access  Public
router.post('/login', loginUser)

export default router
