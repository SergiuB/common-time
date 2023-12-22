"use client";

import { days } from "@/constants";
import { extractSubintervals, subtractBusyIntervals } from "@/lib/time";
import { useState } from "react";
import cn from "classnames";
import { minutesToTime } from "@/lib/time";

interface ClientCalendarProps {
  eventDurationMin: number;
  busyIntervals: {
    start: number;
    end: number;
  }[];
}

export const ClientCalendar = ({
  busyIntervals,
  eventDurationMin = 60,
}: ClientCalendarProps) => {
  const calendarDays = getFutureDays(21);

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

    const freeDaySlots: [number, number][] = freeDayIntervals.reduce(
      (acc, [intervalStartMin, intervalEndMin]) => {
        const slots = extractSubintervals(
          intervalStartMin,
          intervalEndMin,
          eventDurationMin,
          30, // TODO: make this configurable
        );
        return [...acc, ...slots];
      },
      [] as [number, number][],
    );

    const isBusyDay = !freeDayIntervals.length || end < Date.now();
    const isToday = startDate.getDate() === new Date().getDate();

    return {
      isToday,
      isBusyDay,
      startDate,
      freeDaySlots,
    };
  });

  const firstFreeDay = calendarData.find(({ isBusyDay }) => !isBusyDay)
    ?.startDate;

  const [selectedDate, setSelectedDate] = useState(firstFreeDay);

  return (
    <div className="inline-grid grid-flow-row grid-cols-7 gap-0">
      {days.map((day) => (
        <div
          key={day}
          className="w-16 col-span-1 text-small-regular text-neutral-500 justify-center items-center text-center mb-1"
        >
          {day.slice(0, 3).toUpperCase()}
        </div>
      ))}
      {calendarData.map(({ isToday, isBusyDay, startDate, freeDaySlots }) => {
        const isSelected =
          selectedDate && startDate.getDate() === selectedDate.getDate();

        return (
          <div
            key={startDate.getTime()}
            className={cn(
              "col-span-1 w-16 h-16 flex flex-col items-center pt-3 rounded-full text-small-regular",
              {
                "text-neutral-300": isBusyDay,
                "bg-primary-500 text-white": isSelected,
                "cursor-pointer": !isBusyDay && !isSelected,
              },
            )}
            onClick={() => {
              if (isBusyDay || isSelected) return;
              setSelectedDate(startDate);
              const startDateMin = startDate.getTime() / 1000 / 60;
              console.log(
                freeDaySlots.map(([start, end]) => {
                  return [
                    minutesToTime(start - startDateMin),
                    minutesToTime(end - startDateMin),
                  ];
                }),
              );
            }}
          >
            {isToday ? (
              <>
                <p className="text-x-small">TODAY</p>
                <p>{startDate.getDate()}</p>
              </>
            ) : (
              <p className="mt-2.5">{startDate.getDate()}</p>
            )}
          </div>
        );
      })}
    </div>
  );
};

function getStartOfWeek() {
  const today = new Date(); // Today's date
  const dayOfWeek = today.getDay(); // Day of the week (0 for Sunday, 1 for Monday, etc.)
  const startOfWeek = new Date(today);

  // If your week starts on Sunday, use `startOfWeek.setDate(today.getDate() - dayOfWeek);`
  startOfWeek.setDate(today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)); // Set to Monday of the current week

  return startOfWeek;
}

function getFutureDays(count: number) {
  const startOfWeek = getStartOfWeek();
  const futureDays = [];

  for (let i = 0; i < count; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    futureDays.push(date);
  }

  return futureDays.map((date) => ({
    start: date.setHours(0, 0, 0, 0),
    end: date.setHours(23, 59, 59, 999),
  }));
}
