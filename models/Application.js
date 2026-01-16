const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        "consultation",
        "contact",
        "calculate_project",
        "feedback",
        "call_order",
      ],
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: false,
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
