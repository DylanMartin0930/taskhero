import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide a title"],
  },
  description: {
    type: String,
    required: [true, "Please provide a description"],
  },
  folder: [
    {
      section: {
        type: String,
        default: "inbox",
      },
      project: {
        type: String,
      },
    },
  ],
  createdDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  dueDate: {
    type: Date,
  },
});

const Task = mongoose.models.task || mongoose.model("task", taskSchema);

export default Task;
