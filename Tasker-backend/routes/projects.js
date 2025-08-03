import express from 'express'
import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from '../controllers/projectController.js'

import protect from '../middleware/authMiddleware.js'
import { isProjectOwner } from '../middleware/ownershipMiddleware.js'

const router = express.Router()

// @route   POST /api/projects
// @desc    Create a new project
// @access  Private
router.post('/', protect, createProject)

// @route   GET /api/projects
// @desc    Get all projects for the logged-in user
// @access  Private
router.get('/', protect, getAllProjects)

// @route   GET /api/projects/:id
// @desc    Get a single project by ID
// @access  Private (must be the project owner)
router.get('/:id', protect, isProjectOwner, getProjectById)

// @route   PUT /api/projects/:id
// @desc    Update a project
// @access  Private (must be the project owner)
router.put('/:id', protect, isProjectOwner, updateProject)

// @route   DELETE /api/projects/:id
// @desc    Delete a project
// @access  Private (must be the project owner)
router.delete('/:id', protect, isProjectOwner, deleteProject)

export default router
