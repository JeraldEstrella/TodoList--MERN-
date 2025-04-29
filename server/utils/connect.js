import mongoose from "mongoose";

const connection = { isConnected: null };

export const connectToDatabase = async () => {
  try {
    if (connection.isConnected) {
      console.log("Already connected to MongoDB");
      return;
    }

    const db = await mongoose.connect(process.env.MONGO_URL, {
      dbName: "TodoApp", // <-- Add your database name here
    });

    connection.isConnected = db.connections[0].readyState;
    console.log("MongoDB connected successfully!");
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err.message);
  }
};
