import mongoose, { Model } from "mongoose";
import { EventType } from "./types";

const eventTypeSchema = new mongoose.Schema<EventType>({
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, required: true },
  durationMin: { type: Number, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  schedule: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Schedule",
    required: true,
  },
  link: { type: String, required: true },
  color: { type: Number, required: true },
  dateRangeDays: { type: Number, required: true },
  beforeEventMin: { type: Number, required: true },
  afterEventMin: { type: Number, required: true },
});

const EventType =
  (mongoose.models.EventType as Model<EventType>) ||
  mongoose.model<EventType>("EventType", eventTypeSchema);

export default EventType;
