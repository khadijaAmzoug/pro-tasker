import Task from '../models/Task.js'
import Project from '../models/Project.js'

// @desc    Create a new task in a project
// @route   POST /api/projects/:projectId/tasks
// @access  Private
export const createTask = async (req, res) => {
  const { title, description } = req.body
  const { projectId } = req.params

  try {
    // Make sure the project exists and belongs to the user
    const project = await Project.findById(projectId)
    if (!project || project.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' })
    }

    const task = await Task.create({
      title,
      description,
      project: projectId,
    })

    res.status(201).json(task)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

// @desc    Get all tasks in a project
// @route   GET /api/projects/:projectId/tasks
// @access  Private
export const getTasksByProject = async (req, res) => {
  const { projectId } = req.params

  try {
    const project = await Project.findById(projectId)
    if (!project || project.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' })
    }

    const tasks = await Task.find({ project: projectId })
    res.json(tasks)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

// @desc    Update a task
// @route   PUT /api/tasks/:taskId
// @access  Private
export const updateTask = async (req, res) => {
  const { taskId } = req.params
  const { title, description, status } = req.body

  try {
    const task = await Task.findById(taskId).populate('project')
    if (!task || task.project.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' })
    }

    task.title = title || task.title
    task.description = description || task.description
    task.status = status || task.status

    await task.save()
    res.json(task)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

// @desc    Delete a task
// @route   DELETE /api/tasks/:taskId
// @access  Private
export const deleteTask = async (req, res) => {
  const { taskId } = req.params

  try {
    const task = await Task.findById(taskId).populate('project')
    if (!task || task.project.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' })
    }

    await task.deleteOne()
    res.json({ message: 'Task removed' })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}
