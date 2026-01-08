const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema(
  {
    title: {
      uz: { type: String, required: true },
      ru: { type: String, required: true },
      en: { type: String, required: true },
    },
    content: {
      uz: { type: String, required: true },
      ru: { type: String, required: true },
      en: { type: String, required: true },
    },
    image: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("News", newsSchema);
