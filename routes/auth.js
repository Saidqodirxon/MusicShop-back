const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const auth = require("../middleware/auth");

// @route   POST api/auth/register
// @desc    Register admin (for initial setup only)
// @access  Public
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({
      $or: [{ email }, { username }],
    });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new admin
    const admin = new Admin({
      username,
      email,
      password: hashedPassword,
    });

    await admin.save();

    res.status(201).json({ message: "Admin registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route   POST api/auth/login
// @desc    Login admin
// @access  Public
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if admin exists
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Create JWT token
    const payload = {
      admin: {
        id: admin.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          admin: {
            id: admin.id,
            username: admin.username,
            email: admin.email,
          },
        });
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route   GET api/auth/me
// @desc    Get current admin
// @access  Private
router.get("/me", auth, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select("-password");
    res.json(admin);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route   PUT api/auth/update
// @desc    Update admin profile
// @access  Private
router.put("/update", auth, async (req, res) => {
  try {
    const { username, email, currentPassword, newPassword } = req.body;
    const admin = await Admin.findById(req.admin.id);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // If changing password, verify current password
    if (newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, admin.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Current password is incorrect" });
      }

      const salt = await bcrypt.genSalt(10);
      admin.password = await bcrypt.hash(newPassword, salt);
    }

    if (username) admin.username = username;
    if (email) admin.email = email;

    await admin.save();

    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
