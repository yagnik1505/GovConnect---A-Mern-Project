import mongoose from "mongoose";
import dotenv from "dotenv";
import Application from "./models/Application.js";

dotenv.config();

async function migrate() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ Connected to MongoDB");

    const apps = await Application.find();

    let migratedCount = 0;

    for (const app of apps) {
      if (typeof app.itemId === "string") {
        app.itemId = new mongoose.Types.ObjectId(app.itemId);
        await app.save();

        migratedCount++;

        console.log(`Migrated ${app._id}`);
      }
    }

    console.log(`Migration Complete (${migratedCount} documents)`);

    await mongoose.disconnect();

    process.exit(0);

  } catch (err) {

    console.error(err);

    process.exit(1);

  }
}

migrate();