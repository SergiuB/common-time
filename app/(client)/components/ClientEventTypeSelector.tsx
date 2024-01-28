"use client";

import { cn } from "@/lib/utils";
import { colorVariants, eventColors } from "@/constants";
import { minutesToString } from "@/lib/time";
import { Separator } from "@/components/ui/separator";
import { EventTypeBadges } from "@/components/EventTypeBadges";
import { DescriptionMarkdown } from "@/components/DescriptionMarkdown";

interface Props {
  eventTypes: {
    id: string;
    name: string;
    durationMin: number;
    description: string;
    colorId?: string;
    badges?: string;
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
      {eventTypes.map(
        ({ id, name, durationMin, description, badges, colorId }) => {
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
                  className={`w-4 h-4 rounded-full border  border-primary-500 ${
                    isSelected ? "bg-primary-500" : ""
                  }`}
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
              {isSelected && (
                <>
                  <Separator className="my-2" />
                  {badges ? (
                    <div className="text-subtle mb-2">
                      <EventTypeBadges badgeStr={badges} />
                    </div>
                  ) : null}
                  <DescriptionMarkdown>{description}</DescriptionMarkdown>
                </>
              )}
            </div>
          );
        },
      )}
    </div>
  );
};
