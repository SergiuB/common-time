"use server";

import { fetchUser } from "./user.actions";
import EventTypeModel from "../models/event-type.model";
import UserModel from "../models/user.model";
import { Color } from "../models/types";

interface Opts {
  authId: string;
  name: string;
  durationMin: number;
  location: string;
  description: string;
  link: string;
  color: Color;
  dateRangeDays?: number;
  beforeEventMin?: number;
  afterEventMin?: number;
}

export async function createEventType({
  authId,
  name,
  durationMin,
  location,
  description,
  link,
  color,
  dateRangeDays,
  beforeEventMin,
  afterEventMin,
}: Opts): Promise<void> {
  try {
    console.log("creating event type");
    const user = await UserModel.findOne({ authId }).populate({
      path: "eventTypes",
      model: EventTypeModel,
    });

    if (!user) throw new Error("User not found");

    const eventType = new EventTypeModel({
      name,
      durationMin,
      location,
      description,
      link,
      color,
      dateRangeDays,
      beforeEventMin,
      afterEventMin,
      schedule: user?.schedules?.[0],
    });

    await eventType.save();

    user.eventTypes = user.eventTypes || [];
    user.eventTypes.push(eventType);

    await user.save();
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}
