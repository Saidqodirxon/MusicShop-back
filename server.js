const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");

dotenv.config();

const app = express();

// Trust proxy so req.protocol reflects upstream protocol (https when proxied)
app.set("trust proxy", true);

// Middleware
// Allow admin and public frontends to access API via CORS (and localhost for dev)
const allowedOrigins = [
  "https://admin.music-shop.uz",
  "https://www.admin.music-shop.uz",
  "https://music-shop.uz",
  "https://www.music-shop.uz",
  "http://localhost:3000",
  "http://localhost:8808",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
const uploadsPath = path.join(__dirname, "uploads");
console.log(
  "Serving uploads from:",
  uploadsPath,
  "exists:",
  fs.existsSync(uploadsPath)
);
app.use("/uploads", express.static(uploadsPath));

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
app.use("/api/banners", require("./routes/banners"));
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
