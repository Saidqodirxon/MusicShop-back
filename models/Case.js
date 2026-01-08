const mongoose = require("mongoose");

const caseSchema = new mongoose.Schema(
  {
    title: {
      uz: { type: String, required: true },
      ru: { type: String, required: true },
      en: { type: String, required: true },
    },
    description: {
      uz: { type: String, required: true },
      ru: { type: String, required: true },
      en: { type: String, required: true },
    },
    image: {
      type: String,
      required: true,
    },
    document: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Case", caseSchema);
