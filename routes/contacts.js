const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");
const auth = require("../middleware/auth");

// @route   GET api/contacts
// @desc    Get contact info
// @access  Public
router.get("/", async (req, res) => {
  try {
    const contact = await Contact.findOne();
    res.json(contact);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route   POST api/contacts
// @desc    Create or update contact info
// @access  Private
router.post("/", auth, async (req, res) => {
  try {
    let contact = await Contact.findOne();

    if (contact) {
      contact = await Contact.findByIdAndUpdate(contact._id, req.body, {
        new: true,
      });
    } else {
      contact = new Contact(req.body);
      await contact.save();
    }

    res.json(contact);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route   PUT api/contacts/:id
// @desc    Update contact info
// @access  Private
router.put("/:id", auth, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    res.json(contact);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
