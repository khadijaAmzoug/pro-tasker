import express from 'express'
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from '../controllers/taskController.js'

import protect from '../middleware/authMiddleware.js'
import { isProjectOwner, isTaskOwner } from '../middleware/ownershipMiddleware.js'

const router = express.Router()

// @route   POST /api/projects/:projectId/tasks
// @desc    Create a new task under a project
// @access  Private (must be the project owner)
router.post('/projects/:projectId/tasks', protect, isProjectOwner, createTask)

// @route   GET /api/projects/:projectId/tasks
// @desc    Get all tasks under a project
// @access  Private (must be the project owner)
router.get('/projects/:projectId/tasks', protect, isProjectOwner, getTasks)

// @route   GET /api/tasks/:taskId
// @desc    Get a single task by ID
// @access  Private (must be the project owner)
router.get('/tasks/:taskId', protect, isTaskOwner, getTaskById)

// @route   PUT /api/tasks/:taskId
// @desc    Update a task
// @access  Private (must be the project owner)
router.put('/tasks/:taskId', protect, isTaskOwner, updateTask)

// @route   DELETE /api/tasks/:taskId
// @desc    Delete a task
// @access  Private (must be the project owner)
router.delete('/tasks/:taskId', protect, isTaskOwner, deleteTask)

export default router
