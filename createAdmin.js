const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const Admin = require("./models/Admin");
require("dotenv").config();

async function createAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/musicshop",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    console.log("Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username: "admin" });
    if (existingAdmin) {
      console.log("Admin already exists!");
      console.log("Username:", existingAdmin.username);
      console.log("Email:", existingAdmin.email);
      process.exit(0);
    }

    // Create admin
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("admin123", salt);

    const admin = new Admin({
      username: "admin",
      email: "admin@musicshop.com",
      password: hashedPassword,
    });

    await admin.save();

    console.log("✅ Admin created successfully!");
    console.log("Username: admin");
    console.log("Password: admin123");
    console.log("Email: admin@musicshop.com");
    console.log("\n⚠️  Please change the password after first login!");

    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
}

createAdmin();
