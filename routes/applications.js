const express = require("express");
const router = express.Router();
const Application = require("../models/Application");
const auth = require("../middleware/auth");
const {
  sendToTelegram,
  formatApplicationMessage,
} = require("../utils/telegram");

// @route   GET api/applications
// @desc    Get all applications
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const applications = await Application.find().sort({ createdAt: -1 });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route   GET api/applications/:id
// @desc    Get application by ID
// @access  Private
router.get("/:id", auth, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    res.json(application);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route   POST api/applications
// @desc    Create application (public - from website)
// @access  Public
router.post("/", async (req, res) => {
  try {
    const application = new Application(req.body);
    await application.save();

    // Send to Telegram
    const message = formatApplicationMessage(application);
    await sendToTelegram(message);

    res.status(201).json(application);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route   PUT api/applications/:id
// @desc    Update application status
// @access  Private
router.put("/:id", auth, async (req, res) => {
  try {
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    res.json(application);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route   DELETE api/applications/:id
// @desc    Delete application
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const application = await Application.findByIdAndDelete(req.params.id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    res.json({ message: "Application deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
