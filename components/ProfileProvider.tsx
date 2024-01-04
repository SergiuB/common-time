"use client";

import React, { createContext } from "react";

interface Profile {
  fullName: string;
  email: string;
  link: string;
}

interface Props {
  profile: Profile;
}

const ProfileContext = createContext<Profile>({
  fullName: "",
  email: "",
  link: "",
});

export function ProfileProvider({
  children,
  profile,
}: React.PropsWithChildren<Props>) {
  return (
    <ProfileContext.Provider value={profile}>
      {children}
    </ProfileContext.Provider>
  );
}

export const ProfileConsumer = ProfileContext.Consumer;
