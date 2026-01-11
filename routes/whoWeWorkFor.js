const express = require("express");
const router = express.Router();
const WhoWeWorkFor = require("../models/WhoWeWorkFor");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
const { getFileUrl } = require("../utils/fileUrl");

// @route   GET api/who-we-work-for
// @desc    Get all who we work for items
// @access  Public
router.get("/", async (req, res) => {
  try {
    const items = await WhoWeWorkFor.find().sort({ order: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route   GET api/who-we-work-for/:id
// @desc    Get who we work for item by ID
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const item = await WhoWeWorkFor.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route   POST api/who-we-work-for
// @desc    Create who we work for item
// @access  Private
router.post("/", auth, upload.single("image"), async (req, res) => {
  try {
    const itemData = {
      title: JSON.parse(req.body.title),
      description: JSON.parse(req.body.description),
      image: req.file ? getFileUrl(req, req.file.filename) : "",
      order: req.body.order || 0,
    };

    const item = new WhoWeWorkFor(itemData);
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route   PUT api/who-we-work-for/:id
// @desc    Update who we work for item
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

    const item = await WhoWeWorkFor.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route   DELETE api/who-we-work-for/:id
// @desc    Delete who we work for item
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const item = await WhoWeWorkFor.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json({ message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
