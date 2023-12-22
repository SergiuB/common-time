"use client";

import { days } from "@/constants";
import { subtractBusyIntervals } from "@/lib/time";

interface ClientCalendarProps {
  busyIntervals: {
    start: number;
    end: number;
  }[];
}

export const ClientCalendar = ({ busyIntervals }: ClientCalendarProps) => {
  const calendarDays = getFutureDays(21);

  return (
    <div className="inline-grid grid-flow-row grid-cols-7 gap-0">
      {days.map((day) => (
        <div
          key={day}
          className="w-16 col-span-1 text-small-regular text-neutral-500 justify-center items-center text-center"
        >
          {day.slice(0, 3).toUpperCase()}
        </div>
      ))}
      {calendarDays.map(({ start, end }) => {
        const startDate = new Date(start);
        if (startDate.getDate() === 6) {
          console.log(startDate, start);
        }
        if (start === 1704492000000) {
          console.log(start);
        }
        const freeInDay = subtractBusyIntervals(start, end, busyIntervals);

        const busyDay = !freeInDay.length || end < Date.now();
        return (
          <div
            key={start}
            className="col-span-1 w-16 h-16 flex flex-col justify-center items-center"
          >
            <div
              className={`text-small-regular ${
                busyDay ? "text-neutral-300" : "text-gray-800"
              }`}
            >
              <p>{startDate.getDate()}</p>
            </div>
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
