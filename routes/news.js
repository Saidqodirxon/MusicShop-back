const express = require("express");
const router = express.Router();
const News = require("../models/News");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
const { getFileUrl } = require("../utils/fileUrl");

// @route   GET api/news
// @desc    Get all news
// @access  Public
router.get("/", async (req, res) => {
  try {
    const news = await News.find().sort({ date: -1 });
    res.json(news);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route   GET api/news/:id
// @desc    Get news by ID
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const newsItem = await News.findById(req.params.id);
    if (!newsItem) {
      return res.status(404).json({ message: "News not found" });
    }
    res.json(newsItem);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route   POST api/news
// @desc    Create news
// @access  Private
router.post("/", auth, upload.single("image"), async (req, res) => {
  try {
    const newsData = {
      title: JSON.parse(req.body.title),
      content: JSON.parse(req.body.content),
      image: req.file ? getFileUrl(req, req.file.filename) : "",
      date: req.body.date || Date.now(),
    };

    const newsItem = new News(newsData);
    await newsItem.save();
    res.status(201).json(newsItem);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route   PUT api/news/:id
// @desc    Update news
// @access  Private
router.put("/:id", auth, upload.single("image"), async (req, res) => {
  try {
    const updateData = {
      title:
        typeof req.body.title === "string"
          ? JSON.parse(req.body.title)
          : req.body.title,
      content:
        typeof req.body.content === "string"
          ? JSON.parse(req.body.content)
          : req.body.content,
      date: req.body.date,
    };

    if (req.file) {
      updateData.image = getFileUrl(req, req.file.filename);
    }

    const newsItem = await News.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!newsItem) {
      return res.status(404).json({ message: "News not found" });
    }
    res.json(newsItem);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route   DELETE api/news/:id
// @desc    Delete news
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const newsItem = await News.findByIdAndDelete(req.params.id);
    if (!newsItem) {
      return res.status(404).json({ message: "News not found" });
    }
    res.json({ message: "News deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
