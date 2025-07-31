import Project from '../models/Project.js'
import Task from '../models/Task.js'

// Middleware to check if the current user is the owner of the project
export const isProjectOwner = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
    if (!project) {
      return res.status(404).json({ message: 'Project not found' })
    }

    // Check if the logged-in user is the owner of the project
    if (project.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized: not project owner' })
    }

    next()
  } catch (error) {
    console.error('Project ownership check failed:', error.message)
    res.status(500).json({ message: 'Server error' })
  }
}

// Middleware to check if the current user is the owner of the task's project
export const isTaskOwner = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.taskId).populate('project')
    if (!task) {
      return res.status(404).json({ message: 'Task not found' })
    }

    // Check if the task's project belongs to the current user
    if (task.project.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized: not task owner' })
    }

    next()
  } catch (error) {
    console.error('Task ownership check failed:', error.message)
    res.status(500).json({ message: 'Server error' })
  }
}
