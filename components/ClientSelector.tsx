"use client";

import { ClientCalendar } from "@/components/ClientCalendar";
import React, { use, useEffect, useState } from "react";
import { ClientTimeSelector } from "./ClientTimeSelector";
import { ClientEventTypeSelector } from "./ClientEventTypeSelector";
import {
  extractSubintervals,
  getFutureDays,
  getStartOfWeek,
  subtractMultipleIntervals,
} from "@/lib/time";
import { EVENT_STEP_MIN, DAY_NAMES } from "@/constants";
import { Day } from "@/lib/models/types";

interface EventType {
  id: string;
  name: string;
  durationMin: number;
  beforeEventMin: number;
  afterEventMin: number;
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

export const ClientSelector = ({
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

  const schedule = schedules.find(
    ({ id }) => id === selectedEventType.scheduleId,
  )!;

  const calendarData = computeCalendarData(
    busyIntervals,
    selectedEventType.durationMin,
    selectedEventType.beforeEventMin,
    selectedEventType.afterEventMin,
    schedule.intervals,
  );

  const freeDaySlots =
    calendarData.find(
      ({ startDate }) => startDate.getDate() === selectedDay?.getDate(),
    )?.freeDaySlots ?? [];

  console.log(freeDaySlots);

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
      {freeDaySlots.length ? (
        <>
          <h1 className="text-2xl font-semibold mb-4">Select a Time</h1>
          <ClientTimeSelector
            daySlots={freeDaySlots}
            eventType={selectedEventType}
            selectedDay={selectedDay!}
          />
        </>
      ) : (
        "No Slots Available"
      )}
    </div>
  );
};

const computeCalendarData = (
  busyIntervals: { start: number; end: number }[],
  eventDurationMin: number,
  beforeEventMin: number,
  afterEventMin: number,
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

    const freeDayIntervals = subtractMultipleIntervals(
      realStart,
      end,
      busyIntervals.map(({ start, end }) => [start, end]),
    );
    const day = startDate.toLocaleDateString("en-US", { weekday: "long" });

    // get available intervals for day from schedule
    const dayAvailableIntervals = scheduleIntervals
      .filter(({ day: scheduleDay }) => scheduleDay === day)
      // consider time before and after event
      .map(({ startMin, endMin }) => [
        startMin - beforeEventMin,
        endMin + afterEventMin,
      ]) as [number, number][];

    // invert to get busy intervals in day from available intervals
    const dayBusyIntervals = subtractMultipleIntervals(
      0,
      60 * 24,
      dayAvailableIntervals,
    );

    // slots are in minutes since start of day
    const freeDaySlots: [number, number][] = freeDayIntervals
      // convert to minutes since start of day
      .map(([slotStart, slotEnd]) => {
        const dayStartMin = toMinutes(start);
        return [
          toMinutes(slotStart) - dayStartMin,
          toMinutes(slotEnd) - dayStartMin,
        ];
      })
      // filter out slots that are not in schedule
      .reduce(
        (acc, [intervalStartMin, intervalEndMin]) => {
          const slots = subtractMultipleIntervals(
            intervalStartMin,
            intervalEndMin,
            dayBusyIntervals,
          );

          return [...acc, ...slots];
        },
        [] as [number, number][],
      )
      // extract slots of event duration
      .reduce(
        (acc, [intervalStartMin, intervalEndMin]) => {
          const slots = extractSubintervals(
            intervalStartMin + beforeEventMin,
            intervalEndMin - afterEventMin,
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
