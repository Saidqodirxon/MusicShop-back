const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Database connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/musicshop", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/applications", require("./routes/applications"));
app.use("/api/what-we-do", require("./routes/whatWeDo"));
app.use("/api/who-we-work-for", require("./routes/whoWeWorkFor"));
app.use("/api/how-we-work", require("./routes/howWeWork"));
app.use("/api/categories", require("./routes/categories"));
app.use("/api/products", require("./routes/products"));
app.use("/api/cases", require("./routes/cases"));
app.use("/api/about", require("./routes/about"));
app.use("/api/news", require("./routes/news"));
app.use("/api/contacts", require("./routes/contacts"));
app.use("/api/reviews", require("./routes/reviews"));
app.use("/api/faq", require("./routes/faq"));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ message: "Something went wrong!", error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
