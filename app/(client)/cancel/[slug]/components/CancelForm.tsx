"use client";

import { Button } from "@/components/ui/button";
import { cancelEvent } from "@/lib/actions/calendar.actions";
import { CalendarEvent } from "@/lib/types";

interface Props {
  userId: string;
  calendarAccountEmail: string;
  calendarId: string;
  eventData: CalendarEvent;
}

export const CancelForm = ({
  userId,
  calendarAccountEmail,
  calendarId,
  eventData,
}: Props) => {
  return (
    <div className="mb-4">
      <Button
        onClick={() =>
          cancelEvent(userId, calendarAccountEmail, calendarId, eventData)
        }
      >
        Cancel
      </Button>
    </div>
  );
};
