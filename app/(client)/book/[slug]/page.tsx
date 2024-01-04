import { ClientSelector } from "@/components/ClientSelector";
import { ProfileProvider } from "@/components/ProfileProvider";
import { Card, CardContent } from "@/components/ui/card";
import { getUserDataFromLink } from "@/lib/actions/user.actions";
import React from "react";

interface Props {
  params: {
    slug: string;
  };
}

const BookingPage = async ({ params: { slug } }: Props) => {
  const { profile, eventTypes, busyIntervals, schedules } =
    await getUserDataFromLink(slug);
  if (!profile) {
    // TOFO: 404 page
    return <div>Not found</div>;
  }

  const selectedEventTypeId = eventTypes[0].id;

  return (
    <Card>
      <CardContent className="pt-4">
        <ProfileProvider profile={profile}>
          <ClientSelector
            busyIntervals={busyIntervals}
            eventTypes={eventTypes}
            defaultEventTypeId={selectedEventTypeId}
            schedules={schedules}
          />
        </ProfileProvider>
      </CardContent>
    </Card>
  );
};

export default BookingPage;
