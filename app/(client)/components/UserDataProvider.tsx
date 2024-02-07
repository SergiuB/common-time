"use client";

import React, { createContext } from "react";

export interface UserData {
  id: string;
  fullName: string;
  email: string;
  calendarIdForAdd?: string;
}

interface Props {
  userData: UserData;
}

const UserDataContext = createContext<UserData>({
  id: "",
  fullName: "",
  email: "",
});

export function UserDataProvider({
  children,
  userData,
}: React.PropsWithChildren<Props>) {
  return (
    <UserDataContext.Provider value={userData}>
      {children}
    </UserDataContext.Provider>
  );
}

export const UserDataConsumer = UserDataContext.Consumer;
