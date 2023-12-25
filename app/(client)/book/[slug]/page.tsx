import { ClientSlotSelector } from "@/components/ClientSlotSelector";
import { Card, CardContent } from "@/components/ui/card";
import { getUserDataFromLink } from "@/lib/actions/user.actions";
import React from "react";

const EVENT_DURATION_MIN = 60;
const EVENT_STEP_MIN = 30;

interface Props {
  params: {
    slug: string;
  };
}

const BookingPage = async ({ params: { slug } }: Props) => {
  const { profile, eventTypes, busyIntervals } =
    await getUserDataFromLink(slug);
  if (!profile) {
    // TOFO: 404 page
    return <div>Not found</div>;
  }

  const selectedEventTypeId = eventTypes[0].id;

  return (
    <Card>
      <CardContent className="pt-4">
        <ClientSlotSelector
          busyIntervals={busyIntervals}
          eventTypes={eventTypes}
          defaultEventTypeId={selectedEventTypeId}
        />
      </CardContent>
    </Card>
  );
};

export default BookingPage;
