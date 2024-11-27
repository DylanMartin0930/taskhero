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

  isDefault: {
    type: Boolean,
    default: false,
  },

  canWrite: {
    type: Boolean,
    default: false,
  },

  tasks: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true,
      },
      parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "project",
      },
      title: {
        type: String,
        required: [true, "Please provide a title"],
      },
      description: {
        type: String,
        required: [true, "Please provide a description"],
      },
      folder: {
        type: String,
        default: "Inbox",
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
      completestatus: {
        type: Boolean,
        default: false,
      },
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
