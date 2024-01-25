"use client";

import { cn } from "@/lib/utils";
import { colorVariants, eventColors } from "@/constants";
import { minutesToString } from "@/lib/time";
import { Separator } from "@/components/ui/separator";

interface Props {
  eventTypes: {
    id: string;
    name: string;
    durationMin: number;
    description: string;
    color: number;
  }[];

  selectedEventTypeId?: string;

  onSelect: (eventTypeId: string) => void;
}

export const ClientEventTypeSelector = ({
  eventTypes,
  selectedEventTypeId,
  onSelect,
}: Props) => {
  return (
    <div>
      {eventTypes.map(({ id, name, durationMin, description, color }) => {
        const isSelected = id === selectedEventTypeId;
        return (
          <div
            key={id}
            className={cn(
              "p-4 mb-4 border rounded-md cursor-pointer",
              isSelected
                ? "border-primary-500 border-2 shadow-md"
                : "text-neutral-500",
            )}
            onClick={() => onSelect(id)}
          >
            <div className="flex justify-between items-center">
              <div
                style={
                  isSelected
                    ? {
                        borderColor: colorVariants[eventColors[color]],
                        backgroundColor: colorVariants[eventColors[color]],
                      }
                    : {
                        borderColor: colorVariants[eventColors[color]],
                      }
                }
                className={`w-4 h-4 rounded-full border `}
              />
              <div
                className={cn(
                  isSelected ? "text-base-semibold" : "text-base-regular",
                )}
              >
                {name}
              </div>
              <div className="text-small-regular">
                {minutesToString(durationMin)}
              </div>
            </div>
            {isSelected && description && (
              <>
                <Separator className="my-2" />
                <p className="text-small-regular">{description}</p>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};
