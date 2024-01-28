"use server";

import { Day, EventType, Schedule, User } from "../models/types";
import UserModel from "../models/user.model";
import { connectToDb } from "../mongoose";
import { revalidatePath } from "next/cache";
import { RestParameters, memoize } from "../utils";
import { currentUser } from "@clerk/nextjs";
import { Schema, Document } from "mongoose";
import { defaultEndMin, defaultStartMin } from "@/constants";
import {
  fetchEventColors,
  getBusyIntervals,
  getUserBusyIntervals,
} from "./calendar.actions";
import { TokenData } from "./types";

export type UserDocument = Document<unknown, {}, User> &
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

      const fullName = clerkUser.firstName + " " + clerkUser.lastName;

      user.profile = {
        fullName,
        email: clerkUser.emailAddresses?.[0]?.emailAddress || "",
        link: generateValidLink(fullName),
      };

      await user.save();
    }
    return user;
  } catch (error: any) {
    throw new Error(`Failed to create/update user: ${error.message}`);
  }
}

function generateValidLink(fullName: string): string {
  // TODO: check if no conflict with existing links and generate a unique one
  return fullName.replace(/ /g, "_").toLowerCase();
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
  colorId: string;
  beforeEventMin: number;
  afterEventMin: number;
  badges?: string;
  timezone: string;
  scheduleId: string;
}

export async function createEventType({
  authId,
  name,
  durationMin,
  location,
  description,
  link,
  colorId,
  beforeEventMin,
  afterEventMin,
  badges,
  timezone,
  scheduleId,
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
      colorId,
      beforeEventMin,
      afterEventMin,
      badges,
      scheduleId,
      timezone,
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
  colorId,
  beforeEventMin,
  afterEventMin,
  badges,
  timezone,
  scheduleId,
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
    eventType.colorId = colorId;
    eventType.beforeEventMin = beforeEventMin;
    eventType.afterEventMin = afterEventMin;
    eventType.badges = badges;
    eventType.scheduleId = scheduleId;
    eventType.timezone = timezone;

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
      colorId: srcEventType.colorId,
      beforeEventMin: srcEventType.beforeEventMin,
      afterEventMin: srcEventType.afterEventMin,
      scheduleId: srcEventType.scheduleId,
      badges: srcEventType.badges,
      timezone: srcEventType.timezone,
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

export const storeUserCalendarTokens = async (
  user: UserDocument,
  { calendarAccountEmail, accessToken, refreshToken }: TokenData,
) => {
  try {
    let existingTokens = user.calendarTokens
      ? JSON.parse(user.calendarTokens)
      : {};
    existingTokens[calendarAccountEmail] = {
      accessToken,
      refreshToken,
    };
    user.calendarTokens = JSON.stringify(existingTokens);

    await user.save();
  } catch (error: any) {
    throw new Error(`Error storing tokens: ${error.message}`);
  }
};

export const storeCalendarTokens = withCurrentUser(storeUserCalendarTokens);

export const removeCalendarAccount = withCurrentUser(
  async (user: UserDocument, calendarAccountEmail: string) => {
    try {
      // remove tokens
      let tokens = user.calendarTokens ? JSON.parse(user.calendarTokens) : {};
      delete tokens[calendarAccountEmail];
      user.calendarTokens = JSON.stringify(tokens);

      // remove stale calendars
      if (user.calendars) {
        user.calendars.calendarIdsForCheckConflicts = (
          user.calendars.calendarIdsForCheckConflicts || []
        ).filter((id) => !id.startsWith(calendarAccountEmail));

        user.calendars.calendarIdForAdd = (
          user.calendars.calendarIdForAdd || ""
        ).startsWith(calendarAccountEmail)
          ? undefined
          : user.calendars?.calendarIdForAdd;
      }

      await user.save();
      revalidatePath("/calendars");
    } catch (error: any) {
      throw new Error(`Error storing tokens: ${error.message}`);
    }
  },
);

export const getUserCalendarTokens = async (
  user: UserDocument,
  calendarAccountEmail: string,
) => {
  if (!user.calendarTokens) {
    throw new Error("No tokens found");
  }
  const tokens = JSON.parse(user.calendarTokens)[calendarAccountEmail];
  if (!tokens) {
    throw new Error(`No tokens found for ${calendarAccountEmail}`);
  }
  return tokens;
};

export const getCalendarTokens = withCurrentUser(getUserCalendarTokens);

export const getAllCalendarAccountEmails = withCurrentUser(
  async (user: UserDocument) => {
    try {
      if (!user.calendarTokens) return [];
      return Object.keys(JSON.parse(user.calendarTokens));
    } catch (error: any) {
      throw new Error(`Error getting tokens: ${error.message}`);
    }
  },
);

export const getUserCalendarIdForAdd = async (user: UserDocument) => {
  try {
    return user.calendars?.calendarIdForAdd;
  } catch (error: any) {
    throw new Error(`Error getting selected calendar id: ${error.message}`);
  }
};

export const getCalendarIdForAdd = withCurrentUser(getUserCalendarIdForAdd);

export const setCalendarIdForAdd = withCurrentUser(
  async (user: UserDocument, calendarId: string) => {
    try {
      user.calendars = user.calendars || {};
      user.calendars.calendarIdForAdd = calendarId;

      await user.save();
      revalidatePath("/calendars");
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
      revalidatePath("/calendars");
    } catch (error: any) {
      throw new Error(`Error setting selected calendar ids: ${error.message}`);
    }
  },
);

export const getUserCalendarIdsForCheckConflicts = async (
  user: UserDocument,
) => {
  try {
    return user.calendars?.calendarIdsForCheckConflicts || [];
  } catch (error: any) {
    throw new Error(`Error getting selected calendar ids: ${error.message}`);
  }
};

export const getCalendarIdsForCheckConflicts = withCurrentUser(
  getUserCalendarIdsForCheckConflicts,
);

export const saveProfile = withCurrentUser(
  async (
    user: UserDocument,
    { fullName, link, email, imageUrl, businessLogoUrl }: User["profile"],
  ) => {
    try {
      user.profile = {
        fullName,
        link,
        email,
        imageUrl,
        businessLogoUrl,
      };

      await user.save();

      revalidatePath("/profile");
    } catch (error: any) {
      throw new Error(`Error saving profile: ${error.message}`);
    }
  },
);

export const getUserDataFromLink = async (link: string) => {
  try {
    await connectToDb();
    const user = await UserModel.findOne({ "profile.link": link });
    if (!user) {
      throw new Error("User not found");
    }

    const busyIntervals = await getAllBusyIntevals(user);

    return {
      userData: {
        fullName: user.profile.fullName,
        email: user.profile.email,
        imageUrl: user.profile.imageUrl,
        businessLogoUrl: user.profile.businessLogoUrl,
        calendarIdForAdd: user.calendars?.calendarIdForAdd,
      },
      busyIntervals,
      eventTypes: user.eventTypes.map((eventType) => ({
        id: eventType._id!.toString(),
        name: eventType.name,
        durationMin: eventType.durationMin,
        beforeEventMin: eventType.beforeEventMin,
        afterEventMin: eventType.afterEventMin,
        colorId: eventType.colorId,
        location: eventType.location,
        description: eventType.description,
        scheduleId: eventType.scheduleId,
        badges: eventType.badges,
        timezone: eventType.timezone,
      })),
      schedules: user.schedules.map((schedule) => ({
        id: schedule._id!.toString(),
        name: schedule.name,
        intervals: schedule.intervals.map((interval) => ({
          day: interval.day,
          startMin: interval.startMin,
          endMin: interval.endMin,
        })),
      })),
    };
  } catch (error: any) {
    throw new Error(`Failed to get user data from link: ${error.message}`);
  }
};

// returns a list of busy intervals for all calendars that are selected for conflict checking
const getAllBusyIntevals = async (user: UserDocument) => {
  const calendarIds = await getUserCalendarIdsForCheckConflicts(user);

  const groupedCalendarIds = calendarIds.reduce(
    (acc, fullId) => {
      const [email, id] = fullId.split("::");
      const entry = acc.find(([key]) => key === email);
      if (entry) {
        entry[1].push(id);
      } else {
        acc.push([email, [id]]);
      }
      return acc;
    },
    [] as Array<[string, string[]]>,
  );

  const promises = groupedCalendarIds.map(([email, ids]) =>
    getUserBusyIntervals(user, email, ids),
  );

  return (await Promise.all(promises)).flat();
};

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
