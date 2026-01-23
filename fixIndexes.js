const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/musicshop", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected successfully");
    fixIndexes();
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

async function fixIndexes() {
  try {
    const db = mongoose.connection.db;

    // List of collections to check
    const collections = [
      "categories",
      "products",
      "whatwedos",
      "whowewoorkfors",
      "howweworks",
      "cases",
      "news",
      "banners",
      "reviews",
      "faqs",
    ];

    console.log("\nChecking and fixing indexes...\n");

    for (const collectionName of collections) {
      try {
        const collection = db.collection(collectionName);
        const indexes = await collection.indexes();

        console.log(`\n${collectionName}:`);
        console.log("Current indexes:", JSON.stringify(indexes, null, 2));

        // Check if slug index exists
        const slugIndex = indexes.find(
          (idx) => idx.name === "slug_1" || idx.key?.slug
        );

        if (slugIndex) {
          console.log(`  ⚠️  Found slug index: ${slugIndex.name}`);
          console.log(`  🔧 Dropping index: ${slugIndex.name}`);
          await collection.dropIndex(slugIndex.name);
          console.log(`  ✅ Successfully dropped ${slugIndex.name}`);
        } else {
          console.log(`  ✓ No slug index found`);
        }
      } catch (err) {
        if (err.message.includes("ns not found")) {
          console.log(`  ℹ️  Collection doesn't exist yet`);
        } else {
          console.error(
            `  ❌ Error processing ${collectionName}:`,
            err.message
          );
        }
      }
    }

    console.log("\n✅ Index fix completed!\n");
    process.exit(0);
  } catch (err) {
    console.error("Error fixing indexes:", err);
    process.exit(1);
  }
}
