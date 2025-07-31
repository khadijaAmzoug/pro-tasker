import express from 'express'
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from '../controllers/taskController.js'

import protect from '../middleware/authMiddleware.js'
import checkProjectOwnership from '../middleware/ownershipMiddleware.js'

const router = express.Router()

// @route   POST /api/projects/:projectId/tasks
// @desc    Create a new task under a project
// @access  Private (must be owner of the project)
router.post(
  '/projects/:projectId/tasks',
  protect,
  checkProjectOwnership,
  createTask
)

// @route   GET /api/projects/:projectId/tasks
// @desc    Get all tasks under a project
// @access  Private (must be owner of the project)
router.get(
  '/projects/:projectId/tasks',
  protect,
  checkProjectOwnership,
  getTasks
)

// @route   GET /api/tasks/:taskId
// @desc    Get a single task by ID
// @access  Private (must be owner of the task's project)
router.get('/tasks/:taskId', protect, getTaskById)

// @route   PUT /api/tasks/:taskId
// @desc    Update a task
// @access  Private (must be owner of the task's project)
router.put('/tasks/:taskId', protect, updateTask)

// @route   DELETE /api/tasks/:taskId
// @desc    Delete a task
// @access  Private (must be owner of the task's project)
router.delete('/tasks/:taskId', protect, deleteTask)

export default router
