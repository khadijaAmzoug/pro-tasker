import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import connectDB from './config/db.js'; // database connection file
import usersRouter from './routes/users.js';
import projectsRouter from './routes/projects.js';
import tasksRouter from './routes/tasks.js'; // task routes

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB database
connectDB();

const app = express();

// Middleware to parse JSON data
app.use(express.json());

// Enable CORS
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "*", 
    credentials: true,
  })
);

// Routes
app.use('/api/users', usersRouter); // register, login
app.use('/api/projects', projectsRouter); // create, read, update, delete projects
app.use('/api', tasksRouter); // handles tasks under /projects/:projectId/tasks and /tasks/:taskId

// Root route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Centralized error handlers can be added here later

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
