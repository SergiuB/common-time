"use client";

import { ClientCalendar } from "@/components/ClientCalendar";
import React, { use, useEffect, useState } from "react";
import { ClientDaySlotSelector } from "./ClientDaySlotSelector";
import { ClientEventTypeSelector } from "./ClientEventTypeSelector";
import {
  extractSubintervals,
  getFutureDays,
  getStartOfWeek,
  subtractBusyIntervals,
} from "@/lib/time";
import { EVENT_STEP_MIN, DAY_NAMES } from "@/constants";
import { Day } from "@/lib/models/types";

interface EventType {
  id: string;
  name: string;
  durationMin: number;
  color: number;

  description: string;
  location: string;
  scheduleId: string;
}

interface Schedule {
  id: string;
  name: string;
  intervals: {
    day: Day;
    startMin: number;
    endMin: number;
  }[];
}

interface Props {
  busyIntervals: { start: number; end: number }[];
  eventTypes: EventType[];
  defaultEventTypeId: string;
  schedules: Schedule[];
}

export const ClientSlotSelector = ({
  busyIntervals,
  eventTypes,
  defaultEventTypeId,
  schedules,
}: Props) => {
  const [selectedEventTypeId, setSelectedEventTypeId] =
    React.useState(defaultEventTypeId);

  const selectedEventType = eventTypes.find(
    ({ id }) => id === selectedEventTypeId,
  )!;

  const [selectedDay, setSelectedDay] = useState<Date>();
  const [selectedSlot, setSelectedSlot] = useState<{
    startMin: number;
    endMin: number;
  }>();

  const schedule = schedules.find(
    ({ id }) => id === selectedEventType.scheduleId,
  )!;

  console.log(
    "busyIntervals",
    busyIntervals.map(
      ({ start, end }) =>
        new Date(start).toString() + " - " + new Date(end).toString(),
    ),
  );

  console.log("schedule.intervals", schedule.intervals);

  const calendarData = computeCalendarData(
    busyIntervals,
    selectedEventType.durationMin,
    schedule.intervals,
  );

  console.log("calendarData", calendarData);

  const freeDaySlots = calendarData.find(
    ({ startDate }) => startDate.getDate() === selectedDay?.getDate(),
  )?.freeDaySlots;

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
  scheduleIntervals: {
    day: Day;
    startMin: number;
    endMin: number;
  }[],
) => {
  const startOfWeek = getStartOfWeek(new Date());

  const calendarDays = getFutureDays(startOfWeek, 21);

  return calendarDays.map(({ start, end }) => {
    const startDate = new Date(start);
    const isPastDay = end < Date.now();

    if (isPastDay) {
      return {
        isToday: false,
        isBusyDay: true,
        startDate,
        freeDaySlots: [],
      };
    }

    const isToday = startDate.getDate() === new Date().getDate();

    const realStart = isToday ? Date.now() : start;
    const toMinutes = (unixTime: number) => unixTime / 1000 / 60;

    const freeDayIntervals = subtractBusyIntervals(
      realStart,
      end,
      busyIntervals,
    );
    const day = startDate.toLocaleDateString("en-US", { weekday: "long" });

    // slots are in minutes since start of day
    const freeDaySlots: [number, number][] = freeDayIntervals
      .map(([slotStart, slotEnd]) => {
        const dayStartMin = toMinutes(start);
        return [
          toMinutes(slotStart) - dayStartMin,
          toMinutes(slotEnd) - dayStartMin,
        ];
      })
      .reduce(
        (acc, [intervalStartMin, intervalEndMin]) => {
          const dayAvailableIntervals = scheduleIntervals
            .filter(({ day: scheduleDay }) => scheduleDay === day)
            .map(({ startMin, endMin }) => ({
              start: startMin,
              end: endMin,
            }));

          const dayBusyIntervals = subtractBusyIntervals(
            0,
            60 * 24,
            dayAvailableIntervals,
          );

          console.log(
            "daySchedule",
            startDate.getDate(),
            day,
            dayBusyIntervals,
            intervalStartMin,
            intervalEndMin,
          );
          const slots = subtractBusyIntervals(
            intervalStartMin,
            intervalEndMin,
            dayBusyIntervals.map(([start, end]) => ({
              start,
              end,
            })),
          );

          return [...acc, ...slots];
        },
        [] as [number, number][],
      )
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
      );

    const isBusyDay = !freeDaySlots.length;

    return {
      isToday,
      isBusyDay,
      startDate,
      freeDaySlots,
    };
  });
};
