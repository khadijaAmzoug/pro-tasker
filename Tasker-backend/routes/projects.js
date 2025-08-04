import express from 'express'
import {
  createProject,
  listProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from '../controllers/projectController.js'
import { inviteCollaborator } from "../controllers/inviteController.js";
import { isProjectOwner } from "../middleware/ownershipMiddleware.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router()

// @route   POST /api/projects
// @desc    Create a new project
// @access  Private
router.post('/', protect, createProject)

// @route   GET /api/projects
// @desc    Get all projects for the logged-in user
// @access  Private
router.get('/', protect, listProjects)

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


router.post("/:id/invite", protect, isProjectOwner, inviteCollaborator);

router.patch("/:id", protect, isProjectOwner, updateProject);



export default router
