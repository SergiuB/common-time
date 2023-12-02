"use server";

import { access } from "fs";
import { getCalendarTokens } from "./user.actions";
import { getTokensUsingRefreshToken } from "./auth.actions";
import { RestParameters } from "../utils";

interface CalendarData {
  id: string;
  summary: string;
  description: string;
  timeZone: string;
  backgroundColor: string;
  foregroundColor: string;
}

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
>(fetchFn: T, transformFn: P) {
  return async (
    accessToken: string,
    ...args: RestParameters<T>
  ): Promise<ReturnType<P>> => {
    const response = await fetchFn(accessToken, ...args);

    const data = await response.json();

    if (data.error && data.error.code === 401) {
      throw new Error("UNAUTHENTICATED");
    }

    return transformFn(data);
  };
}

function withCalendarTokens<
  T extends (accessToken: string, ...args: any[]) => Promise<any>,
>(fn: T) {
  return async (
    calendarEmail: string,
    ...args: RestParameters<T>
  ): Promise<Awaited<ReturnType<T>>> => {
    const { accessToken, refreshToken } =
      await getCalendarTokens(calendarEmail);

    try {
      return await fn(accessToken, ...args);
    } catch (error: any) {
      if (error.message === "UNAUTHENTICATED") {
        const newTokens = await getTokensUsingRefreshToken(refreshToken);
        if (!newTokens.ok) {
          // redirect to client auth flow
          throw new Error(newTokens.error);
        }

        return await fn(newTokens.accessToken, ...args);
      }

      throw error;
    }
  };
}
