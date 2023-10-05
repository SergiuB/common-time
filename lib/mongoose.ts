import mongoose from "mongoose";

let isConnected: boolean = false;

export const connectToDb = async () => {
  mongoose.set("strictQuery", true);

  if (!process.env.MONGODB_URL) {
    throw new Error("MONGODB_URL must be defined");
  }

  if (isConnected) {
    console.log("Already connected to MongoDB");
    return Promise.resolve();
  }

  try {
    console.log("connecting to db");
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};
