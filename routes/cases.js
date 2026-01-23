const express = require("express");
const router = express.Router();
const Case = require("../models/Case");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
const { getFileUrl } = require("../utils/fileUrl");

// @route   GET api/cases
// @desc    Get all cases
// @access  Public
router.get("/", async (req, res) => {
  try {
    const cases = await Case.find().sort({ createdAt: -1 });
    res.json(cases);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route   GET api/cases/:id
// @desc    Get case by ID
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const caseItem = await Case.findById(req.params.id);
    if (!caseItem) {
      return res.status(404).json({ message: "Case not found" });
    }
    res.json(caseItem);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route   POST api/cases
// @desc    Create case
// @access  Private
router.post(
  "/",
  auth,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "document", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const caseData = {
        title: JSON.parse(req.body.title),
        description: JSON.parse(req.body.description),
        image: req.files.image
          ? getFileUrl(req, req.files.image[0].filename)
          : "",
        document: req.files.document
          ? getFileUrl(req, req.files.document[0].filename)
          : "",
      };

      const caseItem = new Case(caseData);
      await caseItem.save();
      res.status(201).json(caseItem);
    } catch (err) {
      console.error("Error creating case:", err);
      if (err.code === 11000) {
        return res.status(400).json({ 
          message: "Duplicate entry error", 
          error: "A case with this value already exists" 
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
  }
);

// @route   PUT api/cases/:id
// @desc    Update case
// @access  Private
router.put(
  "/:id",
  auth,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "document", maxCount: 1 },
  ]),
  async (req, res) => {
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
      };

      if (req.files.image) {
        updateData.image = getFileUrl(req, req.files.image[0].filename);
      }
      if (req.files.document) {
        updateData.document = getFileUrl(req, req.files.document[0].filename);
      }

      const caseItem = await Case.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
      });

      if (!caseItem) {
        return res.status(404).json({ message: "Case not found" });
      }
      res.json(caseItem);
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  }
);

// @route   DELETE api/cases/:id
// @desc    Delete case
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const caseItem = await Case.findByIdAndDelete(req.params.id);
    if (!caseItem) {
      return res.status(404).json({ message: "Case not found" });
    }
    res.json({ message: "Case deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
