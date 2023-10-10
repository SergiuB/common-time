import mongoose from "mongoose";

export enum Color {
  Red,
  Orange,
  Amber,
  Yellow,
  Lime,
  Green,
  Emerald,
  Teal,
  Cyan,
  Sky,
  Blue,
  Indigo,
  Violet,
  Purple,
  Fuchsia,
  Pink,
  Rose,
}

export interface EventType {
  _id: mongoose.ObjectId;
  name: string;
  createdAt: Date;
  durationMin: number;
  location: string;
  description: string;
  schedule: Schedule;
  link: string;
  color: Color;
  dateRangeDays: number;
  beforeEventMin: number;
  afterEventMin: number;
}

export interface User {
  _id: mongoose.ObjectId;
  authId: string;
  eventTypes: EventType[];
  schedules: Schedule[];
}

export type Day =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export interface Interval {
  day: Day;
  startMin: number;
  endMin: number;
}

export interface Schedule {
  _id: mongoose.ObjectId;
  name: string;
  intervals: Interval[];
  timezone: string;
}
