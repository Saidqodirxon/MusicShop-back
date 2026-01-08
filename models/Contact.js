const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    address: {
      uz: { type: String, required: true },
      ru: { type: String, required: true },
      en: { type: String, required: true },
    },
    email: {
      type: String,
      required: true,
    },
    phones: [
      {
        type: String,
        required: true,
      },
    ],
    workingHours: {
      uz: { type: String, required: true },
      ru: { type: String, required: true },
      en: { type: String, required: true },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contact", contactSchema);
