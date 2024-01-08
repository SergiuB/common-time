"use server";

import { memoize } from "../utils";
import jwt, { JwtPayload } from "jsonwebtoken";
import { TokenData } from "./types";
import { REDIRECT_URI } from "@/constants";

export const getTokensUsingAuthCode = memoize(
  async (authCode: string): Promise<TokenData> => {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },

      body: new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: REDIRECT_URI,
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

    const calendarAccountEmail = (jwt.decode(data.id_token) as JwtPayload)
      ?.email;

    return {
      calendarAccountEmail,
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
    };
  },
);

export const getTokensUsingRefreshToken = async (
  refreshToken: string,
): Promise<TokenData> => {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },

    body: new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: REDIRECT_URI,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      `Failed to get auth token using refresh token: ${
        data!.error_description || data!.error || response.statusText
      }`,
    );
  }

  const calendarAccountEmail = (jwt.decode(data.id_token) as JwtPayload)?.email;

  return {
    accessToken: data.access_token,
    // use the same refresh token if it's not provided
    refreshToken: data.refresh_token || refreshToken,
    calendarAccountEmail,
  };
};
