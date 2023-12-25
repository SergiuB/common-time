"use client";

import { ClientCalendar } from "@/components/ClientCalendar";
import React, { useEffect, useState } from "react";
import { ClientDaySlotSelector } from "./ClientDaySlotSelector";
import { ClientEventTypeSelector } from "./ClientEventTypeSelector";
import {
  extractSubintervals,
  getFutureDays,
  getStartOfWeek,
  subtractBusyIntervals,
} from "@/lib/time";

const EVENT_DURATION_MIN = 60;
const EVENT_STEP_MIN = 30;

interface EventType {
  id: string;
  name: string;
  durationMin: number;
  color: number;

  description: string;
  location: string;
}

interface Props {
  busyIntervals: { start: number; end: number }[];
  eventTypes: EventType[];
  defaultEventTypeId: string;
}

export const ClientSlotSelector = ({
  busyIntervals,
  eventTypes,
  defaultEventTypeId,
}: Props) => {
  const [selectedEventTypeId, setSelectedEventTypeId] =
    React.useState(defaultEventTypeId);

  const selectedEventType = eventTypes.find(
    ({ id }) => id === selectedEventTypeId,
  )!;

  const calendarData = computeCalendarData(
    busyIntervals,
    selectedEventType.durationMin,
  );

  const [selectedDay, setSelectedDay] = useState<Date>();
  const [selectedSlot, setSelectedSlot] = useState<{
    startMin: number;
    endMin: number;
  }>();

  const freeDaySlots = calendarData.find(
    ({ startDate }) => startDate.getDate() === selectedDay?.getDate(),
  )?.freeDaySlots;

  useEffect(() => {
    if (selectedSlot) {
      console.log("selected slot", selectedSlot);
    }
  }, [selectedSlot]);

  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-semibold mb-4">Select an Event</h1>
      <ClientEventTypeSelector
        eventTypes={eventTypes}
        selectedEventTypeId={selectedEventTypeId}
        onSelect={setSelectedEventTypeId}
      />

      <h1 className="text-2xl font-semibold mb-4">Select a Day</h1>
      <ClientCalendar
        calendarData={calendarData}
        onDaySelected={setSelectedDay}
      />
      {freeDaySlots ? (
        <>
          <h1 className="text-2xl font-semibold mb-4">Select a Time</h1>
          <ClientDaySlotSelector
            daySlots={freeDaySlots}
            onSelect={setSelectedSlot}
          />
        </>
      ) : null}
    </div>
  );
};

const computeCalendarData = (
  busyIntervals: { start: number; end: number }[],
  eventDurationMin: number,
) => {
  const startOfWeek = getStartOfWeek(new Date());
  const calendarDays = getFutureDays(startOfWeek, 21);
  return calendarDays.map(({ start, end }) => {
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
            eventDurationMin,
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
};
