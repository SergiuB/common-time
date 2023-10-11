"use server";

import { Color, EventType, Schedule, User } from "../models/types";
import UserModel from "../models/user.model";
import { connectToDb } from "../mongoose";
import { revalidatePath } from "next/cache";

export async function createUserIfNotExists({
  authId,
}: {
  authId: string;
}): Promise<User | null> {
  await connectToDb();

  try {
    const user = await UserModel.findOneAndUpdate(
      { authId },
      {},
      { upsert: true, new: true },
    );

    // set default schedule if none exists
    if (user.schedules?.length === 0) {
      const defaultSchedule: Schedule = {
        name: "Working Hours",
        intervals: [
          { day: "Monday", startMin: 540, endMin: 1020 },
          { day: "Tuesday", startMin: 540, endMin: 1020 },
          { day: "Wednesday", startMin: 540, endMin: 1020 },
          { day: "Thursday", startMin: 540, endMin: 1020 },
          { day: "Friday", startMin: 540, endMin: 1020 },
        ],
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      };

      // user.schedules = user.schedules || [];
      user.schedules.push(defaultSchedule);

      await user.save();
    }
    return user;
  } catch (error: any) {
    throw new Error(`Failed to create/update user: ${error.message}`);
  }
}

export async function fetchUser(authId: string): Promise<User | null> {
  try {
    await connectToDb();

    return await UserModel.findOne({ authId });
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}

interface CreateOpts {
  authId: string;
  name: string;
  durationMin: number;
  location: string;
  description: string;
  link: string;
  color: Color;
  dateRangeDays: number;
  beforeEventMin: number;
  afterEventMin: number;
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
}: CreateOpts): Promise<void> {
  try {
    const user = await UserModel.findOne({ authId });
    if (!user) throw new Error("User not found");
    if (!user?.schedules?.[0]) throw new Error("User has no schedules");

    const eventType: EventType = {
      name,
      durationMin,
      location,
      description,
      link,
      color,
      dateRangeDays,
      beforeEventMin,
      afterEventMin,
      scheduleId: user.schedules?.[0]._id!,
    };

    user.eventTypes.push(eventType);
    await user.save();

    revalidatePath("/event-types");
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}

interface UpdateOpts extends CreateOpts {
  eventId: string;
}

export async function updateEventType({
  authId,
  eventId,
  name,
  durationMin,
  location,
  description,
  link,
  color,
  dateRangeDays,
  beforeEventMin,
  afterEventMin,
}: UpdateOpts): Promise<void> {
  try {
    const user = await UserModel.findOne({ authId });
    if (!user) throw new Error("User not found");
    if (!user?.schedules?.[0]) throw new Error("User has no schedules");

    const eventType = user.eventTypes.id(eventId);
    if (!eventType) throw new Error("Event type not found");

    eventType.name = name;
    eventType.durationMin = durationMin;
    eventType.location = location;
    eventType.description = description;
    eventType.link = link;
    eventType.color = color;
    eventType.dateRangeDays = dateRangeDays;
    eventType.beforeEventMin = beforeEventMin;
    eventType.afterEventMin = afterEventMin;

    await user.save();

    revalidatePath("/event-types");
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}

interface EventOpts {
  authId: string;
  eventId: string;
}

export async function deleteEventType({
  authId,
  eventId,
}: EventOpts): Promise<void> {
  try {
    const user = await UserModel.findOne({ authId });
    if (!user) throw new Error("User not found");

    const eventType = user.eventTypes.id(eventId);
    if (!eventType) throw new Error("Event type not found");

    eventType.deleteOne();

    await user.save();

    revalidatePath("/event-types");
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}

export async function duplicateEventType({
  authId,
  eventId,
}: EventOpts): Promise<void> {
  try {
    const user = await UserModel.findOne({ authId });
    if (!user) throw new Error("User not found");

    const srcEventType = user.eventTypes.id(eventId);
    if (!srcEventType) throw new Error("Event type not found");

    user.eventTypes.push({
      name: srcEventType.name,
      durationMin: srcEventType.durationMin,
      location: srcEventType.location,
      description: srcEventType.description,
      link: srcEventType.link,
      color: srcEventType.color,
      dateRangeDays: srcEventType.dateRangeDays,
      beforeEventMin: srcEventType.beforeEventMin,
      afterEventMin: srcEventType.afterEventMin,
      scheduleId: srcEventType.scheduleId,
    });
    await user.save();

    revalidatePath("/event-types");
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}

export async function fetchEventType({ authId, eventId }: EventOpts) {
  try {
    const user = await UserModel.findOne({ authId });
    if (!user) throw new Error("User not found");

    const srcEventType = user.eventTypes.id(eventId);
    if (!srcEventType) throw new Error("Event type not found");

    return srcEventType;
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}
