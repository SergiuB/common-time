"use server";

import { memoize } from "../utils";
import jwt, { JwtPayload } from "jsonwebtoken";
import { currentUser } from "@clerk/nextjs";
import { storeCalendarTokens } from "./user.actions";

let accesssTokenMap: Record<string, [string, string][]> = {};

type TokenResponse =
  | {
      ok: true;
      accessToken: string;
      refreshToken: string;
      email: string;
    }
  | {
      ok: false;
      error: string;
    };

export const storeTokensUsingAuthCode = memoize(
  async (authCode: string): Promise<void> => {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },

      body: new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI!,
        code: authCode,
        grant_type: "authorization_code",
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to get auth token using auth code: ${response.statusText}`,
      );
    }

    const data = await response.json();

    console.log(data, jwt.decode(data.id_token));
    const calendarEmail = (jwt.decode(data.id_token) as JwtPayload)?.email;

    const user = await currentUser();

    console.log("user", user!.id);

    // // Store access token in memory
    // accesssTokenMap[user!.id] = accesssTokenMap[user!.id] || [];
    // accesssTokenMap[user!.id].push([calendarEmail, data.access_token]);
    // console.log("accesssTokenMap", accesssTokenMap);

    await storeCalendarTokens({
      calendarEmail,
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
    });
  },
);

export const getAuthTokens = async () => {
  // const user = await currentUser();
  // console.log("user", user!.id);
  // console.log("accesssTokenMap", accesssTokenMap);
  // return accesssTokenMap[user!.id] || [];
};

export const getTokensUsingRefreshToken = async (
  refreshToken: string,
): Promise<TokenResponse> => {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },

    body: new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI!,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  if (!response.ok) {
    return {
      ok: false,
      error: `Failed to get auth token using refresh token: ${response.statusText}`,
    };
  }

  const data = await response.json();
  const calendarEmail = (jwt.decode(data.id_token) as JwtPayload)?.email;

  await storeCalendarTokens({
    calendarEmail,
    accessToken: data.access_token,
    refreshToken: data.refresh_token || refreshToken,
  });

  return {
    ok: true,
    accessToken: data.access_token,
    refreshToken: data.refresh_token || refreshToken,
    email: calendarEmail,
  };
};
