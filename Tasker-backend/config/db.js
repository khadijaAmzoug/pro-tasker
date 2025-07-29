import mongoose from 'mongoose'

// Async function to connect to MongoDB
const connectDB = async () => {
  try {
    // Try to connect using the URI from environment variables
    const conn = await mongoose.connect(process.env.MONGO_URI)

    // Log the host name if connected successfully
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    // Log the error message if connection fails
    console.error(`❌ Error: ${error.message}`)

    // Exit the process with failure
    process.exit(1)
  }
}

export default connectDB
