"use server";

import {
  UserDocument,
  fetchUserById,
  getCalendarTokens,
  getUserCalendarTokens,
  storeCalendarTokens,
  storeUserCalendarTokens,
} from "./user.actions";
import { getTokensUsingRefreshToken } from "./auth.actions";
import { RestParameters } from "../utils";
import { CalendarData, CalendarEvent } from "../types";
import { revalidatePath } from "next/cache";
import { encryptSafeUrlPart } from "./crypto.actions";

const tappedFetch = async (...args: Parameters<typeof fetch>) => {
  console.log("fetching", args);
  return fetch(...args);
};

const getEventColors = fetchWithToken(
  (accessToken: string) =>
    fetch("https://www.googleapis.com/calendar/v3/colors", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }),
  (data: {
    event: Record<
      string,
      {
        background: string;
        foreground: string;
      }
    >;
  }) => data.event,
);

export const fetchEventColors = withCalendarTokens(getEventColors);

export const cancelEvent = withUserCalendarTokens(
  fetchWithToken(
    async (accessToken: string, calendarId: string, event: CalendarEvent) => {
      return fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${event.id}`,
        {
          cache: "no-cache",
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            ...event,
            description: "<p>Cancelled via cancel link</p>",
            status: "cancelled",
          }),
        },
      );
    },
  ),
);

const getEvent = fetchWithToken(
  async (accessToken: string, calendarId: string, eventId: string) => {
    return fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${eventId}`,
      {
        cache: "no-cache",
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
  },
  (data: CalendarEvent) => data,
);

export const getEventData = withUserCalendarTokens(getEvent);

const postEvent = fetchWithToken(
  async (
    accessToken: string,
    calendarId: string,
    {
      title,
      startDate,
      endDate,
      colorId,
      attendeeEmail,
      attendeeName,
      attendeeComment,
      userId,
      calendarAccountEmail,
    }: {
      title: string;
      startDate: Date;
      endDate: Date;
      colorId?: string;
      attendeeEmail: string;
      attendeeName: string;
      attendeeComment: string;
      userId: string;
      calendarAccountEmail: string;
    },
  ) => {
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?sendUpdates=all`,
      {
        cache: "no-cache",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          start: {
            dateTime: startDate.toISOString(),
          },
          end: {
            dateTime: endDate.toISOString(),
          },
          summary: title,
          colorId: colorId,
          attendees: [
            {
              email: attendeeEmail,
              displayName: attendeeName,
              comment: attendeeComment,
            },
          ],
          source: {
            title: "common-time",
            url: "https://common-time.com",
          },
        }),
      },
    );

    const eventData = await response.json();
    // we need all this info to generate the cancel link
    const cancelToken = await encryptSafeUrlPart(
      `${userId}::${calendarAccountEmail}::${calendarId}::${eventData.id}`,
      process.env.CANCEL_SECRET_KEY!,
    );

    // TODO: remove this once we get the proper lin
    console.log(cancelToken);

    // update the event with the cancel link
    return fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${eventData.id}`,
      {
        cache: "no-cache",
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          ...eventData,

          description: `<p>Booked via Common Time</p><a href="${process.env.COMMON_TIME_HOST}/cancel/${cancelToken}">Cancel ${cancelToken}</a>`,
        }),
      },
    );
  },
  (data: any) => {
    revalidatePath("/book/[slug]", "page");
    return data;
  },
);

export const createEvent = withUserCalendarTokens(postEvent);

// https://developers.google.com/calendar/api/v3/reference/freebusy/query?apix_params=%7B%22resource%22%3A%7B%22timeMin%22%3A%222023-12-17T00%3A00%3A00Z%22%2C%22timeMax%22%3A%222023-12-20T00%3A00%3A00Z%22%2C%22items%22%3A%5B%7B%22id%22%3A%22e317361c59870053e474d7483a7babc03a78895fc46d2499e23e769407aeca23%40group.calendar.google.com%22%7D%5D%7D%7D
// returns busy intervals for a list of calendars
const fetchBusyIntervals = fetchWithToken(
  (accessToken: string, calendarIds: string[], daysInFuture = 21) =>
    fetch("https://www.googleapis.com/calendar/v3/freeBusy", {
      cache: "no-cache",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        timeMin: new Date().toISOString(),
        timeMax: new Date(
          Date.now() + 1000 * 60 * 60 * 24 * daysInFuture,
        ).toISOString(),
        items: calendarIds.map((id) => ({ id })),
      }),
    }),
  (data: {
    calendars: Record<string, { busy: { start: string; end: string }[] }>;
  }) =>
    Object.values(data.calendars)
      .flatMap((calendar) => calendar.busy)
      .map(({ start, end }) => ({
        start: new Date(start).getTime(),
        end: new Date(end).getTime(),
      })),
);

export const getBusyIntervals = withCalendarTokens(fetchBusyIntervals);
export const getUserBusyIntervals = withUserCalendarTokens(fetchBusyIntervals);

const fetchCalendarList = fetchWithToken(
  (accessToken: string) =>
    fetch("https://www.googleapis.com/calendar/v3/users/me/calendarList", {
      cache: "no-cache",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }),
  (data: { items: CalendarData[] }) => data.items,
);

export const getCalendars = withCalendarTokens(fetchCalendarList);

function fetchWithToken<
  T extends (accessToken: string, ...args: any[]) => Promise<any>,
  P extends (data: any) => any,
>(fetchFn: T, transformFn?: P) {
  return async (
    accessToken: string,
    ...args: RestParameters<T>
  ): Promise<ReturnType<P>> => {
    const response = await fetchFn(accessToken, ...args);

    let data;

    try {
      data = await response.json();
    } catch (error) {
      console.error("Error parsing response", error);
      throw new Error("Error parsing response");
    }

    if (data.error && data.error.code === 401) {
      throw new Error("UNAUTHENTICATED");
    }
    if (data.error && data.error.code === 403) {
      throw new Error(data.error.message || data.error.status || "Forbidden");
    }

    return transformFn ? transformFn(data) : data;
  };
}

/**
 * This function wraps a function that requires a calendar access token.
 * It will automatically refresh the token if it is expired.
 * Works for the current user.
 */

function withCalendarTokens<
  T extends (accessToken: string, ...args: any[]) => Promise<any>,
>(fn: T) {
  return async (
    calendarAccountEmail: string,
    ...args: RestParameters<T>
  ): Promise<Awaited<ReturnType<T>>> => {
    const { accessToken, refreshToken } =
      await getCalendarTokens(calendarAccountEmail);

    try {
      return await fn(accessToken, ...args);
    } catch (error: any) {
      if (error.message === "UNAUTHENTICATED") {
        const newTokens = await getTokensUsingRefreshToken(refreshToken);

        storeCalendarTokens({
          calendarAccountEmail,
          accessToken: newTokens.accessToken,
          refreshToken: newTokens.refreshToken,
        });

        return await fn(newTokens.accessToken, ...args);
      }

      throw error;
    }
  };
}

/**
 * This function wraps a function that requires a calendar access token.
 * It will automatically refresh the token if it is expired.
 * Works for any user.
 */
function withUserCalendarTokens<
  T extends (accessToken: string, ...args: any[]) => Promise<any>,
>(fn: T) {
  return async (
    userOrUserId: UserDocument | string,
    calendarAccountEmail: string,
    ...args: RestParameters<T>
  ): Promise<Awaited<ReturnType<T>>> => {
    const user =
      typeof userOrUserId === "string"
        ? await fetchUserById(userOrUserId)
        : userOrUserId;
    const { accessToken, refreshToken } = await getUserCalendarTokens(
      user,
      calendarAccountEmail,
    );

    try {
      return await fn(accessToken, ...args);
    } catch (error: any) {
      if (error.message === "UNAUTHENTICATED") {
        const newTokens = await getTokensUsingRefreshToken(refreshToken);

        storeUserCalendarTokens(user, {
          calendarAccountEmail,
          accessToken: newTokens.accessToken,
          refreshToken: newTokens.refreshToken,
        });

        return await fn(newTokens.accessToken, ...args);
      }

      throw error;
    }
  };
}
