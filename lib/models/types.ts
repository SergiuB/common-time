import mongoose from "mongoose";

export interface EventType {
  _id: mongoose.ObjectId;
  durationMin: number;
  createdAt: Date;
  author: User;
}

export interface User {
  _id: mongoose.ObjectId;
  authId: string;
  eventTypes: EventType[];
}
