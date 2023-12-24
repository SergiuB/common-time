"use client";

import { ClientCalendar } from "@/components/ClientCalendar";
import { Card, CardContent } from "@/components/ui/card";
import { getUserDataFromLink } from "@/lib/actions/user.actions";
import {
  extractSubintervals,
  getFutureDays,
  getStartOfWeek,
  minutesToTime,
  subtractBusyIntervals,
} from "@/lib/time";
import React, { useCallback, useEffect, useState } from "react";
import { ClientDaySlotSelector } from "./ClientDaySlotSelector";

const EVENT_DURATION_MIN = 60;
const EVENT_STEP_MIN = 30;

interface ClientSlotSelectorProps {
  calendarData: {
    isToday: boolean;
    isBusyDay: boolean;
    startDate: Date;
    // slots are in minutes since start of day
    freeDaySlots: [number, number][];
  }[];
}

export const ClientSlotSelector = ({
  calendarData,
}: ClientSlotSelectorProps) => {
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
      <ClientCalendar
        calendarData={calendarData}
        onDaySelected={setSelectedDay}
      />
      {freeDaySlots ? (
        <ClientDaySlotSelector
          daySlots={freeDaySlots}
          onSelect={setSelectedSlot}
        />
      ) : null}
    </div>
  );
};
