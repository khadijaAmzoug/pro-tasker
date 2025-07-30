import express from 'express'
import {
  createTask,
  getTasksByProject,
  updateTask,
  deleteTask,
} from '../controllers/taskController.js'
import protect from '../middleware/authMiddleware.js'

const router = express.Router()

// Route: POST /api/projects/:projectId/tasks - Create a task for a project
router.post('/projects/:projectId/tasks', protect, createTask)

// Route: GET /api/projects/:projectId/tasks - Get all tasks for a project
router.get('/projects/:projectId/tasks', protect, getTasksByProject)

// Route: PUT /api/tasks/:taskId - Update a specific task
router.put('/tasks/:taskId', protect, updateTask)

// Route: DELETE /api/tasks/:taskId - Delete a specific task
router.delete('/tasks/:taskId', protect, deleteTask)

export default router
