import jwt from 'jsonwebtoken'

// This function generates a JWT for a given user ID
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Token expires in 30 days
  })
}

export default generateToken