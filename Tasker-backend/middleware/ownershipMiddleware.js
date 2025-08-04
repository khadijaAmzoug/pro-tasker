import Project from "../models/Project.js";
import Task from "../models/Task.js";

/**
 * isProjectOwner
 * - Allows ONLY the project owner
 * - Works with routes using :id or :projectId
 */
export const isProjectOwner = async (req, res, next) => {
  try {
    const projectId = req.params.projectId || req.params.id;
    const project = await Project.findById(projectId).select("owner");
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized: owner only" });
    }

    req.project = project;
    next();
  } catch (error) {
    console.error("Project ownership check failed:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * isTaskOwner (fixed)
 * - Allows ONLY the owner of the task's parent project
 * - NOTE: checks project.owner (not project.user)
 */
export const isTaskOwner = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findById(taskId).select("project");
    if (!task) return res.status(404).json({ message: "Task not found" });

    const project = await Project.findById(task.project).select("owner");
    if (!project) return res.status(404).json({ message: "Parent project not found" });

    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized: not task owner" });
    }

    req.task = task;
    req.project = project;
    next();
  } catch (error) {
    console.error("Task ownership check failed:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * isProjectMember (NEW)
 * - Allows project OWNER or any COLLABORATOR
 * - Requires Project model to have: collaborators: [ObjectId]
 */
export const isProjectMember = async (req, res, next) => {
  try {
    const projectId = req.params.projectId || req.params.id;
    const project = await Project.findById(projectId).select("owner collaborators");
    if (!project) return res.status(404).json({ message: "Project not found" });

    const uid = req.user.id.toString();
    const isOwner = project.owner.toString() === uid;
    const isCollab = project.collaborators?.some((c) => c.toString() === uid);

    if (!isOwner && !isCollab) {
      return res.status(403).json({ message: "Not authorized for this project" });
    }

    req.project = project;
    next();
  } catch (error) {
    console.error("Project member check failed:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * isTaskMember (NEW)
 * - Allows OWNER or COLLABORATOR of the task's parent project
 */
export const isTaskMember = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findById(taskId).select("project");
    if (!task) return res.status(404).json({ message: "Task not found" });

    const project = await Project.findById(task.project).select("owner collaborators");
    if (!project) return res.status(404).json({ message: "Parent project not found" });

    const uid = req.user.id.toString();
    const isOwner = project.owner.toString() === uid;
    const isCollab = project.collaborators?.some((c) => c.toString() === uid);

    if (!isOwner && !isCollab) {
      return res.status(403).json({ message: "Not authorized for this task" });
    }

    req.task = task;
    req.project = project;
    next();
  } catch (error) {
    console.error("Task member check failed:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
