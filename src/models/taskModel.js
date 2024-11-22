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

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "task",
    required: true,
  },

  folder: {
    type: String,
    default: "Inbox",
  },

  Completestatus: {
    type: Boolean,
    default: false,
  },

  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "project",
  },

  createdDate: {
    type: Date,
    required: true,
    default: Date.now,
  },

  dueDate: {
    type: Date,
    default: null,
  },

  assignedDate: {
    type: Date,
    default: null,
  },

  completeDate: {
    type: Date,
    default: null,
  },
});

const Task = mongoose.models.task || mongoose.model("task", taskSchema);

export default Task;
