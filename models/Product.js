const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      uz: { type: String, required: true },
      ru: { type: String, required: true },
      en: { type: String, required: true },
    },
    description: {
      uz: { type: String, required: true },
      ru: { type: String, required: true },
      en: { type: String, required: true },
    },
    images: [
      {
        type: String,
      },
    ],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    showOnSite: {
      type: Boolean,
      default: true,
    },
    isTopProduct: {
      type: Boolean,
      default: false,
    },
    price: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
