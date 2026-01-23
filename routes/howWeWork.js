const express = require("express");
const router = express.Router();
const HowWeWork = require("../models/HowWeWork");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
const { getFileUrl } = require("../utils/fileUrl");

// @route   GET api/how-we-work
// @desc    Get all how we work items
// @access  Public
router.get("/", async (req, res) => {
  try {
    const items = await HowWeWork.find().sort({ order: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route   GET api/how-we-work/:id
// @desc    Get how we work item by ID
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const item = await HowWeWork.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route   POST api/how-we-work
// @desc    Create how we work item
// @access  Private
router.post("/", auth, upload.single("image"), async (req, res) => {
  try {
    const itemData = {
      title: JSON.parse(req.body.title),
      description: JSON.parse(req.body.description),
      image: req.file ? getFileUrl(req, req.file.filename) : "",
      order: req.body.order || 0,
    };

    const item = new HowWeWork(itemData);
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    console.error("Error creating how-we-work item:", err);
    if (err.code === 11000) {
      return res.status(400).json({
        message: "Duplicate entry error",
        error: "An item with this value already exists",
      });
    }
    if (err.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation error",
        error: err.message,
      });
    }
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route   PUT api/how-we-work/:id
// @desc    Update how we work item
// @access  Private
router.put("/:id", auth, upload.single("image"), async (req, res) => {
  try {
    const updateData = {
      title:
        typeof req.body.title === "string"
          ? JSON.parse(req.body.title)
          : req.body.title,
      description:
        typeof req.body.description === "string"
          ? JSON.parse(req.body.description)
          : req.body.description,
      order: req.body.order,
    };

    if (req.file) {
      updateData.image = getFileUrl(req, req.file.filename);
    }

    const item = await HowWeWork.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route   DELETE api/how-we-work/:id
// @desc    Delete how we work item
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const item = await HowWeWork.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json({ message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
