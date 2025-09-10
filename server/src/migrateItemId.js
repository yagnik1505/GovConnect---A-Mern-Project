import mongoose from "mongoose";
import Application from "./models/Application.js";

async function migrate() {
  try {
    await mongoose.connect(process.env.MONGO_URI); // Use your MongoDB connection string here or from env

    console.log("Connected to DB");

    const apps = await Application.find({}).exec();
    let migratedCount = 0;

    for (const app of apps) {
      if (typeof app.itemId === "string") {
        app.itemId = mongoose.Types.ObjectId(app.itemId);
        await app.save();
        migratedCount++;
        console.log(`Migrated Application ID: ${app._id}`);
      }
    }

    console.log(`Migration completed. Total migrated: ${migratedCount}`);

    await mongoose.disconnect();

  } catch (err) {
    console.error("Migration failed:", err);
  }
}

migrate();
