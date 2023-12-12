"use server";

import {
  Color,
  Day,
  EventType,
  Interval,
  Schedule,
  User,
} from "../models/types";
import UserModel from "../models/user.model";
import { connectToDb } from "../mongoose";
import { revalidatePath } from "next/cache";
import { RestParameters, memoize } from "../utils";
import { currentUser } from "@clerk/nextjs";
import { Schema, Document } from "mongoose";
import { defaultEndMin, defaultStartMin } from "@/constants";

type UserDocument = Document<unknown, {}, User> &
  User &
  Required<{
    _id: Schema.Types.ObjectId;
  }>;

export async function createUserIfNotExists(): Promise<User | null> {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    throw new Error("User not logged in");
  }

  await connectToDb();

  try {
    const user = await UserModel.findOneAndUpdate(
      { authId: clerkUser.id },
      {},
      { upsert: true, new: true },
    );

    // set default schedule if none exists
    if (user.schedules?.length === 0) {
      const defaultSchedule: Schedule = {
        name: "Working Hours",
        intervals: [
          { day: "Monday", startMin: defaultStartMin, endMin: defaultEndMin },
          { day: "Tuesday", startMin: defaultStartMin, endMin: defaultEndMin },
          {
            day: "Wednesday",
            startMin: defaultStartMin,
            endMin: defaultEndMin,
          },
          { day: "Thursday", startMin: defaultStartMin, endMin: defaultEndMin },
          { day: "Friday", startMin: defaultStartMin, endMin: defaultEndMin },
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

export async function fetchUser(authId: string) {
  try {
    await connectToDb();
    const user = await UserModel.findOne({ authId });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
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
    throw new Error(`Failed to create event type: ${error.message}`);
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
    throw new Error(`Failed to update event type: ${error.message}`);
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
    throw new Error(`Failed to delete event type: ${error.message}`);
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
    throw new Error(`Failed to duplicate event type: ${error.message}`);
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
    throw new Error(`Failed to get event types: ${error.message}`);
  }
}

export async function fetchSchedules({ authId }: { authId: string }) {
  try {
    const user = await UserModel.findOne({ authId });
    if (!user) throw new Error("User not found");

    return user.schedules;
  } catch (error: any) {
    throw new Error(`Failed to get user schedules: ${error.message}`);
  }
}

export async function createSchedule({
  authId,
  name,
}: {
  authId: string;
  name: string;
}) {
  try {
    const user = await UserModel.findOne({ authId });
    if (!user) throw new Error("User not found");

    const defaultSchedule: Schedule = {
      name: name,
      intervals: [
        { day: "Monday", startMin: defaultStartMin, endMin: defaultEndMin },
        { day: "Tuesday", startMin: defaultStartMin, endMin: defaultEndMin },
        { day: "Wednesday", startMin: defaultStartMin, endMin: defaultEndMin },
        { day: "Thursday", startMin: defaultStartMin, endMin: defaultEndMin },
        { day: "Friday", startMin: defaultStartMin, endMin: defaultEndMin },
      ],
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };

    // user.schedules = user.schedules || [];
    user.schedules.push(defaultSchedule);

    await user.save();

    revalidatePath("/availability");
  } catch (error: any) {
    throw new Error(`Failed to get user schedules: ${error.message}`);
  }
}

export const updateSchedule = withCurrentUser(
  async (
    user: UserDocument,
    {
      scheduleId,
      name,
      intervals,
    }: {
      scheduleId: string;
      name: string;
      intervals: {
        day: Day;
        startMin: number;
        endMin: number;
      }[];
    },
  ) => {
    try {
      const schedule = user.schedules?.id(scheduleId);
      if (!schedule) throw new Error("Schedule not found");

      schedule.name = name;
      schedule.intervals = intervals;

      await user.save();

      revalidatePath("/availability");
    } catch (error: any) {
      throw new Error(`Failed to update schedule: ${error.message}`);
    }
  },
);

export const storeCalendarTokens = withCurrentUser(
  async (
    user: UserDocument,
    {
      calendarEmail,
      accessToken,
      refreshToken,
    }: {
      calendarEmail: string;
      accessToken: string;
      refreshToken: string;
    },
  ) => {
    try {
      let existingTokens = user.calendarTokens
        ? JSON.parse(user.calendarTokens)
        : {};
      existingTokens[calendarEmail] = {
        accessToken,
        refreshToken,
      };
      user.calendarTokens = JSON.stringify(existingTokens);

      await user.save();
    } catch (error: any) {
      throw new Error(`Error storing tokens: ${error.message}`);
    }
  },
);

export const removeCalendarTokens = withCurrentUser(
  async (user: UserDocument, calendarEmail: string) => {
    try {
      let tokens = user.calendarTokens ? JSON.parse(user.calendarTokens) : {};
      delete tokens[calendarEmail];
      user.calendarTokens = JSON.stringify(tokens);

      await user.save();
      revalidatePath("/calendars");
    } catch (error: any) {
      throw new Error(`Error storing tokens: ${error.message}`);
    }
  },
);

export const getCalendarTokens = withCurrentUser(
  async (user: UserDocument, calendarEmail: string) => {
    if (!user.calendarTokens) {
      throw new Error("No tokens found");
    }
    const tokens = JSON.parse(user.calendarTokens)[calendarEmail];
    if (!tokens) {
      throw new Error(`No tokens found for ${calendarEmail}`);
    }
    return tokens;
  },
);

export const getAllCalendarEmails = withCurrentUser(
  async (user: UserDocument) => {
    try {
      if (!user.calendarTokens) return [];
      return Object.keys(JSON.parse(user.calendarTokens));
    } catch (error: any) {
      throw new Error(`Error getting tokens: ${error.message}`);
    }
  },
);

export const getCalendarIdForAdd = withCurrentUser(
  async (user: UserDocument) => {
    try {
      return user.calendars?.calendarIdForAdd;
    } catch (error: any) {
      throw new Error(`Error getting selected calendar id: ${error.message}`);
    }
  },
);

export const setCalendarIdForAdd = withCurrentUser(
  async (user: UserDocument, calendarId: string) => {
    try {
      user.calendars = user.calendars || {};
      user.calendars.calendarIdForAdd = calendarId;

      await user.save();
    } catch (error: any) {
      throw new Error(`Error setting selected calendar id: ${error.message}`);
    }
  },
);

export const setCalendarIdForCheckConflicts = withCurrentUser(
  async (user: UserDocument, calendarIds: string[]) => {
    try {
      user.calendars = user.calendars || {};
      user.calendars.calendarIdsForCheckConflicts = calendarIds;

      await user.save();
    } catch (error: any) {
      throw new Error(`Error setting selected calendar ids: ${error.message}`);
    }
  },
);

export const getCalendarIdsForCheckConflicts = withCurrentUser(
  async (user: UserDocument) => {
    try {
      return user.calendars?.calendarIdsForCheckConflicts || [];
    } catch (error: any) {
      throw new Error(`Error getting selected calendar ids: ${error.message}`);
    }
  },
);

function withCurrentUser<
  T extends (user: UserDocument, ...args: any[]) => Promise<any>,
>(fn: T) {
  return async (
    ...args: RestParameters<T>
  ): Promise<Awaited<ReturnType<T>>> => {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      throw new Error("User not logged in");
    }
    const user = await fetchUser(clerkUser.id);
    return fn(user, ...args);
  };
}
