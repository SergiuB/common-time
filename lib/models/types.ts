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
  scheduleId: string;
  link: string;
  color: Color;
  dateRangeDays: number;
  beforeEventMin: number;
  afterEventMin: number;
}

interface EventTypeSubdoc extends EventType {
  deleteOne: () => Promise<void>;
}

interface EventTypeCollection extends Array<EventType> {
  id: (id: string) => EventTypeSubdoc | null;
}

export interface User {
  _id: mongoose.ObjectId;
  authId: string;
  eventTypes: EventTypeCollection;
  schedules: ScheduleCollection;
  // we serialize the token map due to Mongoose poor support for Maps
  calendarTokens: string;
  calendars: {
    calendarIdForAdd?: string;
    calendarIdsForCheckConflicts: string[];
  };
  profile: {
    fullName: string;
    email: string;
    link: string;
    imageUrl?: string;
    businessLogoUrl?: string;
  };
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

interface ScheduleSubdoc extends Schedule {
  deleteOne: () => Promise<void>;
}
export interface ScheduleCollection extends Array<Schedule> {
  id: (id: string) => ScheduleSubdoc | null;
}

export interface CalendarTokens {
  accessToken: string;
  refreshToken: string;
}
