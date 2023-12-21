import { ClientCalendar } from "@/components/ClientCalendar";
import { Card, CardContent } from "@/components/ui/card";
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
  return (
    <Card>
      <CardContent className="pt-4">
        <ClientCalendar busyIntervals={busyIntervals} />
      </CardContent>
    </Card>
  );
};

export default BookingPage;
