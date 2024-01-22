"use server";

import { connectToDb } from "../mongoose";
import { getTokensUsingRefreshToken } from "./auth.actions";
import { UserDocument, storeUserCalendarTokens } from "./user.actions";
import UserModel from "../models/user.model";

const getAllUsers = async () => {
  await connectToDb();
  return UserModel.find();
};

async function cycleRefreshTokensForUser(user: UserDocument) {
  if (!user.calendarTokens) {
    throw new Error("No tokens found");
  }
  const allCalendarTokens = JSON.parse(user.calendarTokens) as Record<
    string,
    { accessToken: string; refreshToken: string }
  >;

  Object.entries(allCalendarTokens).forEach(
    ([calendarAccountEmail, { refreshToken }]) => {
      console.log(
        "cycling refresh token for",
        calendarAccountEmail,
        "with refresh token",
        refreshToken,
      );
      getTokensUsingRefreshToken(refreshToken).then((newTokens) => {
        storeUserCalendarTokens(user, {
          calendarAccountEmail,
          accessToken: newTokens.accessToken,
          refreshToken: newTokens.refreshToken,
        }),
          console.log(
            "new refresh token for",
            calendarAccountEmail,
            "is",
            newTokens.refreshToken,
          );
      });
    },
  );
}

export async function cycleRefreshTokens() {
  const users = await getAllUsers();

  users.forEach((user: UserDocument) => {
    cycleRefreshTokensForUser(user);
  });
}
