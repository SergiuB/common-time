"use client";

import * as React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateTimesInDay, minutesToTime, timeToMinutes } from "@/lib/time";

interface Props {
  minutes: number;
  onChange?: (minutes: number) => void;
}

export const TimeSelect = ({ minutes, onChange }: Props) => {
  const times = generateTimesInDay(15);
  return (
    <Select
      value={minutesToTime(minutes)}
      onValueChange={(time) => onChange && onChange(timeToMinutes(time))}
    >
      <SelectTrigger className="w-24">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <ScrollArea className="h-72 ">
          <SelectGroup>
            {times.map((time) => (
              <SelectItem key={time} value={time}>
                {time}
              </SelectItem>
            ))}
          </SelectGroup>
        </ScrollArea>
      </SelectContent>
    </Select>
  );
};
