import mongoose, { Model } from "mongoose";
import { Schedule, Interval } from "./types";

const intervalSchema = new mongoose.Schema<Interval>(
  {
    day: { type: String, required: true },
    startMin: { type: Number, required: true },
    endMin: { type: Number, required: true },
  },
  { _id: false },
);

const scheduleSchema = new mongoose.Schema<Schedule>({
  name: { type: String, required: true },
  intervals: [intervalSchema],
  timezone: { type: String, required: true },
});

const Schedule =
  (mongoose.models.Schedule as Model<Schedule>) ||
  mongoose.model<Schedule>("Schedule", scheduleSchema);

export default Schedule;
