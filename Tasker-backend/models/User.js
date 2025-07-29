import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

// Define the user schema with fields and validation
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // User's name
    email: { type: String, required: true, unique: true }, // Must be unique
    password: { type: String, required: true }, // Hashed password
    isAdmin: { type: Boolean, required: true, default: false }, // Optional flag
  },
  { timestamps: true } // Adds createdAt and updatedAt automatically
)

// Method to compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

// Middleware to hash password before saving the user
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next() // Only hash if password is changed
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

// Create and export the model
const User = mongoose.model('User', userSchema)
export default User
