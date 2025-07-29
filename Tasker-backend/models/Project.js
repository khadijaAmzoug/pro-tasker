import mongoose from "mongoose";

// Define the schema for a Project
const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true, // Title is required
      trim: true, // Remove whitespace from both sides
    },
    description: {
      type: String,
      default: "", // Optional description
      trim: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true, // A project must have an owner
      ref: "User", // Reference to the User model
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

// Create and export the Project model
const Project = mongoose.model("Project", projectSchema);
export default Project;
