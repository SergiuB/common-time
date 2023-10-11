import mongoose, { Model } from "mongoose";

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
  _id?: mongoose.ObjectId;
  name: string;
  durationMin: number;
  location: string;
  description: string;
  scheduleId: mongoose.ObjectId;
  link: string;
  color: Color;
  dateRangeDays: number;
  beforeEventMin: number;
  afterEventMin: number;
}

interface EventTypeCollection extends Array<EventType> {
  id: (id: string) => {
    deleteOne: () => Promise<void>;
  };
}

export interface User {
  _id: mongoose.ObjectId;
  authId: string;
  eventTypes: EventTypeCollection;
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
  _id?: mongoose.ObjectId;
  day: Day;
  startMin: number;
  endMin: number;
}

export interface Schedule {
  _id?: mongoose.ObjectId;
  name: string;
  intervals: Interval[];
  timezone: string;
}
