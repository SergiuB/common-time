"use server";

import {
  UserDocument,
  getCalendarTokens,
  getUserCalendarTokens,
  storeCalendarTokens,
  storeUserCalendarTokens,
} from "./user.actions";
import { getTokensUsingRefreshToken } from "./auth.actions";
import { RestParameters } from "../utils";
import { CalendarData } from "../types";

const tappedFetch = async (...args: Parameters<typeof fetch>) => {
  console.log("fetching", args);
  return fetch(...args);
};

const postEvent = fetchWithToken(
  (
    accessToken: string,
    calendarId: string,
    {
      title,
    }: {
      title: string;
    },
  ) =>
    fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`,
      {
        cache: "no-cache",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          start: {
            dateTime: new Date().toISOString(),
          },
          end: {
            dateTime: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
          },
          summary: title,
        }),
      },
    ),
);

export const createEvent = withCalendarTokens(postEvent);

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

    const data = await response.json();

    if (data.error && data.error.code === 401) {
      throw new Error("UNAUTHENTICATED");
    }
    if (data.error && data.error.code === 403) {
      throw new Error(data.error.message || data.error.status || "Forbidden");
    }

    return transformFn ? transformFn(data) : data;
  };
}

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

function withUserCalendarTokens<
  T extends (accessToken: string, ...args: any[]) => Promise<any>,
>(fn: T) {
  return async (
    user: UserDocument,
    calendarAccountEmail: string,
    ...args: RestParameters<T>
  ): Promise<Awaited<ReturnType<T>>> => {
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
