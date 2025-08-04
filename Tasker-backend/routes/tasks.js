
import express from 'express'
import {
  createTask,
  getTasksByProject,
  updateTask,
  deleteTask,
} from '../controllers/taskController.js'

import protect from '../middleware/authMiddleware.js'
import { isProjectOwner, isTaskOwner } from '../middleware/ownershipMiddleware.js'

const router = express.Router()

// @route   POST /api/projects/:projectId/tasks
// @desc    Create a new task under a project
// @access  Private (must be owner of the project)
router.post(
  '/projects/:projectId/tasks',
  protect,
  isProjectOwner,
  createTask
)

// @route   GET /api/projects/:projectId/tasks
// @desc    Get all tasks under a project
// @access  Private (must be owner of the project)
router.get(
  '/projects/:projectId/tasks',
  protect,
  isProjectOwner,
  getTasksByProject
)

// @route   PUT /api/tasks/:taskId
// @desc    Update a task
// @access  Private (must be owner of the task's project)
router.put('/tasks/:taskId', protect, isTaskOwner, updateTask)

// @route   DELETE /api/tasks/:taskId
// @desc    Delete a task
// @access  Private (must be owner of the task's project)
router.delete('/tasks/:taskId', protect, isTaskOwner, deleteTask)

export default router
