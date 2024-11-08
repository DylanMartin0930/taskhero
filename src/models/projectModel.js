import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide a title"],
  },
  description: {
    type: String,
    default: null,
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "task",
    required: true,
  },

  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "task",
      default: null,
    },
  ],

  folder: {
    type: String,
    default: "Inbox",
  },

  createdDate: {
    type: Date,
    required: true,
    default: Date.now,
  },

  completeDate: {
    type: Date,
    default: null,
  },

  Completestatus: {
    type: Boolean,
    default: false,
  },
});

const Project =
  mongoose.models.project || mongoose.model("project", projectSchema);

export default Project;
