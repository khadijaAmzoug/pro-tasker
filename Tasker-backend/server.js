import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import connectDB from './config/db.js'; // database connection file
import usersRouter from './routes/users.js'; // import user routes

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB database
connectDB();

const app = express();

// Middleware to parse JSON data
app.use(express.json());

// Enable CORS
app.use(cors());

// Routes
app.use('/api/users', usersRouter); // user-related endpoints (register, login)

// Example root route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Centralized error handlers can be added here later

const PORT = process.env.PORT || 5000;

// Start server after DB connection
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});