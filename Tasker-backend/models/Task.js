import mongoose from "mongoose";

// Define the schema for a Task
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true, // Task must have a title
      trim: true,
    },
    description: {
      type: String,
      default: "", // Optional task description
      trim: true,
    },
    status: {
      type: String,
      enum: ["To Do", "In Progress", "Done"], // Only allow specific status values
      default: "To Do", // Default status
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      required: true, // Task must belong to a project
      ref: "Project", // Reference to the Project model
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Create and export the Task model
const Task = mongoose.model("Task", taskSchema);
export default Task;
