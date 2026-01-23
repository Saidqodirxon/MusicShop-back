const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const auth = require("../middleware/auth");

// @route   GET api/reviews
// @desc    Get all active reviews
// @access  Public
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(6);
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route   GET api/reviews/all
// @desc    Get all reviews (admin)
// @access  Private
router.get("/all", auth, async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route   GET api/reviews/:id
// @desc    Get review by ID
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    res.json(review);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route   POST api/reviews
// @desc    Create review
// @access  Private
router.post("/", auth, async (req, res) => {
  try {
    const review = new Review(req.body);
    await review.save();
    res.status(201).json(review);
  } catch (err) {
    console.error("Error creating review:", err);
    if (err.code === 11000) {
      return res.status(400).json({
        message: "Duplicate entry error",
        error: "A review with this value already exists",
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

// @route   PUT api/reviews/:id
// @desc    Update review
// @access  Private
router.put("/:id", auth, async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    res.json(review);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route   DELETE api/reviews/:id
// @desc    Delete review
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    res.json({ message: "Review deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
