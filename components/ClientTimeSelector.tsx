"use client";

import { minutesToTime } from "@/lib/time";
import React from "react";

interface SlotSelectFn {
  ({ startMin, endMin }: { startMin: number; endMin: number }): void;
}

interface Props {
  daySlots: [number, number][];
  onSelect: SlotSelectFn;
}

export const ClientTimeSelector = ({ daySlots, onSelect }: Props) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {daySlots.map(([startMin, endMin]) => (
        <Slot
          key={startMin}
          startMin={startMin}
          endMin={endMin}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
};

interface SlotProps {
  startMin: number;
  endMin: number;
  onSelect: SlotSelectFn;
}

const Slot = ({ startMin, endMin, onSelect }: SlotProps) => {
  return (
    <div
      className="cursor-pointer border rounded-md border-neutral-300 h-12 flex justify-center items-center "
      onClick={() => onSelect({ startMin, endMin })}
    >
      {`${minutesToTime(startMin)} - ${minutesToTime(endMin)}`}
    </div>
  );
};
