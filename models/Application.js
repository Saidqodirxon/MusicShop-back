const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["standard", "calculate_project"],
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    message: {
      type: String,
    },
    status: {
      type: String,
      enum: ["new", "in_progress", "completed", "rejected"],
      default: "new",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Application", applicationSchema);
