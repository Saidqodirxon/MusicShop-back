const express = require("express");
const router = express.Router();
const Banner = require("../models/Banner");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
const { getFileUrl } = require("../utils/fileUrl");

// @route   GET api/banners
// @desc    Get all banners
// @access  Public
router.get("/", async (req, res) => {
  try {
    const banners = await Banner.find().sort({ createdAt: -1 });
    res.json(banners);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route   GET api/banners/:id
// @desc    Get banner by ID
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }
    res.json(banner);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route   POST api/banners
// @desc    Create banner
// @access  Private
router.post("/", auth, upload.single("image"), async (req, res) => {
  try {
    const bannerData = {
      image: req.file ? getFileUrl(req, req.file.filename) : "",
    };

    const banner = new Banner(bannerData);
    await banner.save();
    res.status(201).json(banner);
  } catch (err) {
    console.error("Error creating banner:", err);
    if (err.code === 11000) {
      return res.status(400).json({
        message: "Duplicate entry error",
        error: "A banner with this value already exists",
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

// @route   PUT api/banners/:id
// @desc    Update banner
// @access  Private
router.put("/:id", auth, upload.single("image"), async (req, res) => {
  try {
    const updateData = {};

    if (req.file) {
      updateData.image = getFileUrl(req, req.file.filename);
    }

    const banner = await Banner.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }
    res.json(banner);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route   DELETE api/banners/:id
// @desc    Delete banner
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);
    if (!banner) {
      return res.status(404).json({ message: "Banner not found" });
    }
    res.json({ message: "Banner deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
