"use client";

import { DAY_NAMES } from "@/constants";
import { useEffect, useState } from "react";
import cn from "classnames";
import { minutesToTime } from "@/lib/time";

interface ClientCalendarProps {
  onDaySelected: (date: Date) => void;
  calendarData: {
    isToday: boolean;
    isBusyDay: boolean;
    startDate: Date;
  }[];
}

export const ClientCalendar = ({
  calendarData,
  onDaySelected,
}: ClientCalendarProps) => {
  const firstFreeDay = calendarData.find(({ isBusyDay }) => !isBusyDay)
    ?.startDate;

  const [selectedDate, setSelectedDate] = useState(firstFreeDay);

  useEffect(() => {
    if (selectedDate) {
      onDaySelected(selectedDate);
    }
  }, [selectedDate, onDaySelected]);

  return (
    <div className="grid grid-cols-7 gap-0">
      {DAY_NAMES.map((day) => (
        <div
          key={day}
          className=" col-span-1 text-small-regular text-neutral-500 justify-center items-center text-center mb-1"
        >
          {day.slice(0, 3).toUpperCase()}
        </div>
      ))}
      {calendarData.map(({ isToday, isBusyDay, startDate }) => {
        const isSelected =
          selectedDate && startDate.getDate() === selectedDate.getDate();

        return (
          <div
            key={startDate.getTime()}
            className={cn(
              "col-span-1 h-12 md:h-14 flex flex-col items-center pt-1.5 md:pt-2.5 rounded-full text-small-regular",
              {
                "text-neutral-300": isBusyDay,
                "bg-primary-500 text-white": isSelected,
                "cursor-pointer": !isBusyDay && !isSelected,
              },
            )}
            onClick={() => {
              if (isBusyDay || isSelected) return;
              setSelectedDate(startDate);
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
