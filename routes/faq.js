const express = require("express");
const router = express.Router();
const FAQ = require("../models/FAQ");
const auth = require("../middleware/auth");

// @route   GET api/faq
// @desc    Get all FAQ items
// @access  Public
router.get("/", async (req, res) => {
  try {
    const faqs = await FAQ.find().sort({ order: 1 });
    res.json(faqs);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route   GET api/faq/:id
// @desc    Get FAQ by ID
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const faq = await FAQ.findById(req.params.id);
    if (!faq) {
      return res.status(404).json({ message: "FAQ not found" });
    }
    res.json(faq);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route   POST api/faq
// @desc    Create FAQ
// @access  Private
router.post("/", auth, async (req, res) => {
  try {
    const faq = new FAQ(req.body);
    await faq.save();
    res.status(201).json(faq);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route   PUT api/faq/:id
// @desc    Update FAQ
// @access  Private
router.put("/:id", auth, async (req, res) => {
  try {
    const faq = await FAQ.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!faq) {
      return res.status(404).json({ message: "FAQ not found" });
    }
    res.json(faq);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route   DELETE api/faq/:id
// @desc    Delete FAQ
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const faq = await FAQ.findByIdAndDelete(req.params.id);
    if (!faq) {
      return res.status(404).json({ message: "FAQ not found" });
    }
    res.json({ message: "FAQ deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
