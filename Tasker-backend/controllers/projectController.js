import Project from '../models/Project.js' // Import the Project model

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private
export const createProject = async (req, res) => {
  try {
    const { title, description } = req.body

    // Create a new project and associate it with the logged-in user
    const project = await Project.create({
      title,
      description,
      owner: req.user._id, // user must be authenticated
    })

    res.status(201).json(project)
  } catch (error) {
    res.status(500).json({ message: 'Server error while creating project' })
  }
}

// @desc    Get all projects for the logged-in user
// @route   GET /api/projects
// @access  Private
export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.user._id })
    res.json(projects)
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching projects' })
  }
}

// @desc    Get a single project by ID
// @route   GET /api/projects/:id
// @access  Private
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)

    if (!project || project.owner.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Project not found or unauthorized' })
    }

    res.json(project)
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching project' })
  }
}

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private
export const updateProject = async (req, res) => {
  try {
    const { title, description } = req.body
    const project = await Project.findById(req.params.id)

    if (!project || project.owner.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Project not found or unauthorized' })
    }

    project.title = title || project.title
    project.description = description || project.description

    const updatedProject = await project.save()
    res.json(updatedProject)
  } catch (error) {
    res.status(500).json({ message: 'Server error while updating project' })
  }
}

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)

    if (!project || project.owner.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Project not found or unauthorized' })
    }

    await project.deleteOne()
    res.json({ message: 'Project deleted' })
  } catch (error) {
    res.status(500).json({ message: 'Server error while deleting project' })
  }
}