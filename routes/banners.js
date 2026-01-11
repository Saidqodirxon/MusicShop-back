const express = require("express");
const router = express.Router();
const Banner = require("../models/Banner");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");

// @route   GET api/banners
// @desc    Get all banners
// @access  Public
router.get("/", async (req, res) => {
  try {
    const banners = await Banner.find().sort({ order: 1, createdAt: -1 });
    res.json(banners);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route   GET api/banners/active
// @desc    Get all active banners
// @access  Public
router.get("/active", async (req, res) => {
  try {
    const banners = await Banner.find({ isActive: true }).sort({ order: 1 });
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
      title: JSON.parse(req.body.title),
      description: req.body.description
        ? JSON.parse(req.body.description)
        : { uz: "", ru: "", en: "" },
      image: req.file ? `/uploads/${req.file.filename}` : "",
      link: req.body.link || "",
      order: req.body.order || 0,
      isActive: req.body.isActive === "true" || req.body.isActive === true,
    };

    const banner = new Banner(bannerData);
    await banner.save();
    res.status(201).json(banner);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route   PUT api/banners/:id
// @desc    Update banner
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
      link: req.body.link,
      order: req.body.order,
      isActive: req.body.isActive === "true" || req.body.isActive === true,
    };

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
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
