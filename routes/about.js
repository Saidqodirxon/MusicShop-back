const express = require("express");
const router = express.Router();
const About = require("../models/About");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
const { getFileUrl } = require("../utils/fileUrl");

// @route   GET api/about
// @desc    Get about info
// @access  Public
router.get("/", async (req, res) => {
  try {
    const about = await About.findOne();
    res.json(about);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route   POST api/about
// @desc    Create or update about info
// @access  Private
router.post(
  "/",
  auth,
  upload.fields([
    { name: "banner", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const aboutData = {
        mainText: JSON.parse(req.body.mainText),
        additionalText: JSON.parse(req.body.additionalText),
      };

      if (req.files.banner) {
        aboutData.banner = getFileUrl(req, req.files.banner[0].filename);
      }
      if (req.files.image) {
        aboutData.image = getFileUrl(req, req.files.image[0].filename);
      }

      let about = await About.findOne();

      if (about) {
        about = await About.findByIdAndUpdate(about._id, aboutData, {
          new: true,
        });
      } else {
        about = new About(aboutData);
        await about.save();
      }

      res.json(about);
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  }
);

// @route   PUT api/about/:id
// @desc    Update about info
// @access  Private
router.put(
  "/:id",
  auth,
  upload.fields([
    { name: "banner", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const updateData = {
        mainText:
          typeof req.body.mainText === "string"
            ? JSON.parse(req.body.mainText)
            : req.body.mainText,
        additionalText:
          typeof req.body.additionalText === "string"
            ? JSON.parse(req.body.additionalText)
            : req.body.additionalText,
      };

      if (req.files && req.files.banner) {
        updateData.banner = getFileUrl(req, req.files.banner[0].filename);
      }
      if (req.files && req.files.image) {
        updateData.image = getFileUrl(req, req.files.image[0].filename);
      }

      const about = await About.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
      });

      if (!about) {
        return res.status(404).json({ message: "About not found" });
      }
      res.json(about);
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  }
);

module.exports = router;
