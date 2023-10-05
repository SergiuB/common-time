"use server";

import { User } from "../models/types";
import UserModel from "../models/user.model";
import { connectToDb } from "../mongoose";

export async function updateUser({
  authId,
}: {
  authId: string;
}): Promise<User | null> {
  await connectToDb();

  try {
    return await UserModel.findOneAndUpdate(
      { authId },
      {},
      { upsert: true, new: true },
    );
  } catch (error: any) {
    throw new Error(`Failed to create/update user: ${error.message}`);
  }
}
