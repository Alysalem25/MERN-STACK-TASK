const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const TaskSchema = new mongoose.Schema(
  {
    //  title, description, status, priority, and due date
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["TODO", "IN_PROGRESS", "DONE"],
    },
    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH"],
    },
    dueDate: {
      type: Date,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Task", TaskSchema);
