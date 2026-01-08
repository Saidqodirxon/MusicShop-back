const mongoose = require("mongoose");

const whatWeDoSchema = new mongoose.Schema(
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
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("WhatWeDo", whatWeDoSchema);
