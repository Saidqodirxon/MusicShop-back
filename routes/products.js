const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
const { getFileUrl } = require("../utils/fileUrl");

// @route   GET api/products
// @desc    Get all products
// @access  Public
router.get("/", async (req, res) => {
  try {
    const { category, inStock, showOnSite, isTopProduct } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (inStock !== undefined) filter.inStock = inStock === "true";
    if (showOnSite !== undefined) filter.showOnSite = showOnSite === "true";
    if (isTopProduct !== undefined)
      filter.isTopProduct = isTopProduct === "true";

    const products = await Product.find(filter)
      .populate("category")
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route   GET api/products/:id
// @desc    Get product by ID
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route   POST api/products
// @desc    Create product
// @access  Private
router.post("/", auth, upload.array("images", 4), async (req, res) => {
  try {
    const productData = {
      name: JSON.parse(req.body.name),
      description: JSON.parse(req.body.description),
      category: req.body.category,
      inStock: req.body.inStock === "true",
      showOnSite: req.body.showOnSite === "true",
      isTopProduct: req.body.isTopProduct === "true",
      price: req.body.price,
      images: req.files
        ? req.files.map((file) => getFileUrl(req, file.filename))
        : [],
    };

    const product = new Product(productData);
    await product.save();
    await product.populate("category");
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route   PUT api/products/:id
// @desc    Update product
// @access  Private
router.put("/:id", auth, upload.array("images", 4), async (req, res) => {
  try {
    const updateData = {
      name:
        typeof req.body.name === "string"
          ? JSON.parse(req.body.name)
          : req.body.name,
      description:
        typeof req.body.description === "string"
          ? JSON.parse(req.body.description)
          : req.body.description,
      category: req.body.category,
      inStock: req.body.inStock === "true",
      showOnSite: req.body.showOnSite === "true",
      isTopProduct: req.body.isTopProduct === "true",
      price: req.body.price,
    };

    // Handle images: keep existing ones and add new ones
    if (req.body.existingImages) {
      const existingImages =
        typeof req.body.existingImages === "string"
          ? JSON.parse(req.body.existingImages)
          : req.body.existingImages;
      updateData.images = existingImages.map((img) => getFileUrl(req, img));
    } else {
      updateData.images = [];
    }

    // Add new uploaded images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => getFileUrl(req, file.filename));
      updateData.images = [...updateData.images, ...newImages];
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    }).populate("category");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route   DELETE api/products/:id
// @desc    Delete product
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
