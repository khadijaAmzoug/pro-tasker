import Project from "../models/Project.js";
import User from "../models/User.js";

/**
 * POST /api/projects/:id/invite
 * Body: { email: string }
 * Requires: protect + isProjectOwner
 */
export const inviteCollaborator = async (req, res) => {
  try {
    const { email } = req.body;
    const projectId = req.params.id;

    if (!email) return res.status(400).json({ message: "Email is required" });

    // Project must exist (owner already verified in middleware)
    const project = await Project.findById(projectId).select("owner collaborators");
    if (!project) return res.status(404).json({ message: "Project not found" });

    // Find user by email
    const user = await User.findOne({ email }).select("_id email");
    if (!user) return res.status(404).json({ message: "User not found" });

    // Can't invite the owner
    if (user._id.toString() === project.owner.toString()) {
      return res.status(400).json({ message: "Owner is already a member" });
    }

    // Avoid duplicates
    const already =
      Array.isArray(project.collaborators) &&
      project.collaborators.some((c) => c.toString() === user._id.toString());
    if (already) {
      return res.status(400).json({ message: "User is already a collaborator" });
    }

    // Add collaborator
    project.collaborators = project.collaborators || [];
    project.collaborators.push(user._id);
    await project.save();

    return res.status(200).json({
      message: "Collaborator invited successfully",
      collaborator: { id: user._id, email: user.email },
    });
  } catch (err) {
    console.error("Invite collaborator failed:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
};
