import mongoose, { Model } from "mongoose";
import { User } from "./types";

const userSchema = new mongoose.Schema<User>({
  authId: { type: String, required: true, unique: true },
  eventTypes: [{ type: mongoose.Schema.Types.ObjectId, ref: "EventType" }],
  schedules: [{ type: mongoose.Schema.Types.ObjectId, ref: "Schedule" }],
});

const User =
  (mongoose.models.User as Model<User>) ||
  mongoose.model<User>("User", userSchema);

export default User;
