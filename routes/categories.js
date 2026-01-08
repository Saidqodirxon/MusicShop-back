const express = require("express");
const router = express.Router();
const Category = require("../models/Category");
const auth = require("../middleware/auth");

// @route   GET api/categories
// @desc    Get all categories
// @access  Public
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route   GET api/categories/:id
// @desc    Get category by ID
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route   POST api/categories
// @desc    Create category
// @access  Private
router.post("/", auth, async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route   PUT api/categories/:id
// @desc    Update category
// @access  Private
router.put("/:id", auth, async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route   DELETE api/categories/:id
// @desc    Delete category
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
