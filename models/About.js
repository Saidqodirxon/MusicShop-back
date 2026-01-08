const mongoose = require("mongoose");

const aboutSchema = new mongoose.Schema(
  {
    banner: {
      type: String,
      required: true,
    },
    mainText: {
      uz: { type: String, required: true },
      ru: { type: String, required: true },
      en: { type: String, required: true },
    },
    image: {
      type: String,
      required: true,
    },
    additionalText: {
      uz: { type: String, required: true },
      ru: { type: String, required: true },
      en: { type: String, required: true },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("About", aboutSchema);
