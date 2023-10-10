"use server";

import { User } from "../models/types";
import UserModel from "../models/user.model";
import ScheduleModel from "../models/schedule.model";
import EventTypeModel from "../models/event-type.model";
import { connectToDb } from "../mongoose";

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
      const defaultSchedule = new ScheduleModel({
        name: "Working Hours",
        intervals: [
          { day: "Monday", startMin: 540, endMin: 1020 },
          { day: "Tuesday", startMin: 540, endMin: 1020 },
          { day: "Wednesday", startMin: 540, endMin: 1020 },
          { day: "Thursday", startMin: 540, endMin: 1020 },
          { day: "Friday", startMin: 540, endMin: 1020 },
        ],
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });

      await defaultSchedule.save();

      user.schedules = user.schedules || [];
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

    return await UserModel.findOne({ authId })
      .populate({ path: "eventTypes", model: EventTypeModel })
      .populate({ path: "schedules", model: ScheduleModel });
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}
