import { getUserDataFromLink } from "@/lib/actions/user.actions";
import React from "react";

interface Props {
  params: {
    slug: string;
  };
}

const BookingPage = async ({ params: { slug } }: Props) => {
  const { profile, busyIntervals } = await getUserDataFromLink(slug);
  if (!profile) {
    // TOFO: 404 page
    return <div>Not found</div>;
  }
  return <div>{profile.fullName}</div>;
};

export default BookingPage;
