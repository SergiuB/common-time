import { ClientSlotSelector } from "@/components/ClientSlotSelector";
import { Card, CardContent } from "@/components/ui/card";
import { getUserDataFromLink } from "@/lib/actions/user.actions";
import {
  extractSubintervals,
  getFutureDays,
  getStartOfWeek,
  minutesToTime,
  subtractBusyIntervals,
} from "@/lib/time";
import React, { useCallback } from "react";

const EVENT_DURATION_MIN = 60;
const EVENT_STEP_MIN = 30;

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

  const startOfWeek = getStartOfWeek(new Date());
  const calendarDays = getFutureDays(startOfWeek, 21);

  const calendarData = calendarDays.map(({ start, end }) => {
    const startDate = new Date(start);
    const toMinutes = ([start, end]: [number, number]) => [
      start / 1000 / 60,
      end / 1000 / 60,
    ];
    const freeDayIntervals = subtractBusyIntervals(
      start,
      end,
      busyIntervals,
    ).map(toMinutes);

    // slots are in minutes since start of day
    const freeDaySlots: [number, number][] = freeDayIntervals
      .reduce(
        (acc, [intervalStartMin, intervalEndMin]) => {
          const slots = extractSubintervals(
            intervalStartMin,
            intervalEndMin,
            EVENT_DURATION_MIN,
            EVENT_STEP_MIN,
          );
          return [...acc, ...slots];
        },
        [] as [number, number][],
      )
      .map(([startOfSlot, endOfSlot]) => {
        const dayStartMin = start / 1000 / 60;
        return [startOfSlot - dayStartMin, endOfSlot - dayStartMin];
      });

    const isBusyDay = !freeDayIntervals.length || end < Date.now();
    const isToday = startDate.getDate() === new Date().getDate();

    return {
      isToday,
      isBusyDay,
      startDate,
      freeDaySlots,
    };
  });

  return (
    <Card>
      <CardContent className="pt-4">
        <ClientSlotSelector calendarData={calendarData} />
      </CardContent>
    </Card>
  );
};

export default BookingPage;
