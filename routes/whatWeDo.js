const express = require("express");
const router = express.Router();
const WhatWeDo = require("../models/WhatWeDo");
const auth = require("../middleware/auth");

// @route   GET api/what-we-do
// @desc    Get all what we do items
// @access  Public
router.get("/", async (req, res) => {
  try {
    const items = await WhatWeDo.find().sort({ order: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route   GET api/what-we-do/:id
// @desc    Get what we do item by ID
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const item = await WhatWeDo.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route   POST api/what-we-do
// @desc    Create what we do item
// @access  Private
router.post("/", auth, async (req, res) => {
  try {
    const item = new WhatWeDo(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    console.error("Error creating what-we-do item:", err);
    if (err.code === 11000) {
      return res.status(400).json({ 
        message: "Duplicate entry error", 
        error: "An item with this value already exists" 
      });
    }
    if (err.name === "ValidationError") {
      return res.status(400).json({ 
        message: "Validation error", 
        error: err.message 
      });
    }
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route   PUT api/what-we-do/:id
// @desc    Update what we do item
// @access  Private
router.put("/:id", auth, async (req, res) => {
  try {
    const item = await WhatWeDo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json(item);
  } catch (err) {
    console.error("Error updating what-we-do item:", err);
    if (err.code === 11000) {
      return res.status(400).json({ 
        message: "Duplicate entry error", 
        error: "An item with this value already exists" 
      });
    }
    if (err.name === "ValidationError") {
      return res.status(400).json({ 
        message: "Validation error", 
        error: err.message 
      });
    }
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route   DELETE api/what-we-do/:id
// @desc    Delete what we do item
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const item = await WhatWeDo.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json({ message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
