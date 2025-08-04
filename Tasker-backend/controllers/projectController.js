import Project from "../models/Project.js";

/**
 * GET /api/projects
 * - List projects owned by the current user
 */
export const listProjects = async (req, res) => {
  try {
    const docs = await Project.find({ owner: req.user.id })
      .sort({ createdAt: -1 })
      .lean();
    res.json(docs);
  } catch (err) {
    console.error("listProjects:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET /api/projects/:id
 * - Get single project (owner or collaborator should be checked in middleware)
 * - Optional: populate collaborators to show (name/email)
 */
export const getProjectById = async (req, res) => {
  try {
    const doc = await Project.findById(req.params.id)
      .populate("collaborators", "name email _id")
      .lean();
    if (!doc) return res.status(404).json({ message: "Project not found" });
    res.json(doc);
  } catch (err) {
    console.error("getProjectById:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * POST /api/projects
 * - Create new project with { name, description }
 */
export const createProject = async (req, res) => {
  try {
    const { name, description = "" } = req.body;
    if (!name?.trim()) {
      return res.status(400).json({ message: "Name is required" });
    }
    const doc = await Project.create({
      name: name.trim(),
      description: description.trim(),
      owner: req.user.id,
    });
    res.status(201).json(doc);
  } catch (err) {
    console.error("createProject:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * PATCH /api/projects/:id
 * - Update project (owner or collaborator? عادةً المالك فقط للتعديلات)
 * - Accepts partial { name?, description? }
 */
export const updateProject = async (req, res) => {
  try {
    const fields = {};
    if (typeof req.body.name === "string") fields.name = req.body.name.trim();
    if (typeof req.body.description === "string")
      fields.description = req.body.description.trim();

    const doc = await Project.findByIdAndUpdate(
      req.params.id,
      { $set: fields },
      { new: true }
    );
    if (!doc) return res.status(404).json({ message: "Project not found" });
    res.json(doc);
  } catch (err) {
    console.error("updateProject:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * DELETE /api/projects/:id
 * - Delete project 
 */
export const deleteProject = async (req, res) => {
  try {
    const doc = await Project.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ message: "Project not found" });
    res.json({ message: "Project deleted" });
  } catch (err) {
    console.error("deleteProject:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};
