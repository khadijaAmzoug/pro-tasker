// File: backend/models/Project.js
import mongoose from "mongoose";

// Define the schema for a Project
const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true, // Title is required
      trim: true,
    },
    description: {
      type: String,
      default: "", // Optional description
      trim: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true, // A project must have an owner
      ref: "User",
      index: true,
    },
    // NEW: collaborators (users invited to this project)
    collaborators: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        index: true,
      },
    ],
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// Optional helper: check membership (owner or collaborator)
projectSchema.methods.isMember = function (userId) {
  const uid = userId?.toString();
  if (!uid) return false;
  const isOwner = this.owner.toString() === uid;
  const isCollab = Array.isArray(this.collaborators)
    ? this.collaborators.some((c) => c.toString() === uid)
    : false;
  return isOwner || isCollab;
};

// Create and export the Project model
const Project = mongoose.model("Project", projectSchema);
export default Project;
