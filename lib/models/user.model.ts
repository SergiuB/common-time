import mongoose, { Model } from "mongoose";
import { Schedule, Interval, EventType, User, CalendarTokens } from "./types";

const intervalSchema = new mongoose.Schema<Interval>({
  day: { type: String, required: true },
  startMin: { type: Number, required: true },
  endMin: { type: Number, required: true },
});

const scheduleSchema = new mongoose.Schema<Schedule>({
  name: { type: String, required: true },
  intervals: [intervalSchema],
  timezone: { type: String, required: true },
});

const eventTypeSchema = new mongoose.Schema<EventType>({
  name: { type: String, required: true },
  durationMin: { type: Number, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  scheduleId: {
    type: String,
    required: true,
  },
  link: { type: String, required: true },
  color: { type: Number, required: true },
  beforeEventMin: { type: Number, required: true },
  afterEventMin: { type: Number, required: true },
  badges: { type: String },
  timezone: { type: String, required: true },
});

const userSchema = new mongoose.Schema<User>({
  authId: { type: String, required: true, unique: true },
  eventTypes: [eventTypeSchema],
  schedules: [scheduleSchema],
  calendarTokens: { type: String },
  calendars: {
    calendarIdForAdd: String,
    calendarIdsForCheckConflicts: [String],
  },
  profile: {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    link: { type: String, required: true },
    imageUrl: { type: String },
    businessLogoUrl: { type: String },
  },
});

const User =
  (mongoose.models.User as Model<User>) ||
  mongoose.model<User>("User", userSchema);

export default User;
