"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { use, useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CalendarData, getCalendarUniqueId } from "@/lib/types";
import {
  setCalendarIdForAdd,
  setCalendarIdForCheckConflicts,
} from "@/lib/actions/user.actions";
import debounce from "lodash/debounce";

interface CalendarConfigurationCardProps {
  calendarsByEmail: { email: string; calendars: CalendarData[] }[];
  calendarIds: string[];
}

export const CheckForConflictsCard = ({
  calendarsByEmail,
  calendarIds,
}: CalendarConfigurationCardProps) => {
  const [selectedCalendarIds, setSelectedCalendarIds] =
    useState<string[]>(calendarIds);

  const handleCalendarChange = useCallback(
    (checked: boolean, calendarId: string) => {
      setSelectedCalendarIds((prev) => {
        if (checked) {
          return [...prev, calendarId];
        } else {
          return prev.filter((id) => id !== calendarId);
        }
      });
    },
    [],
  );

  const debouncedSetCalendarIdsForCheckConflicts = useCallback(
    debounce((calendarIds: string[]) => {
      setCalendarIdForCheckConflicts(calendarIds);
    }, 1000),
    [setCalendarIdForCheckConflicts],
  );

  useEffect(() => {
    debouncedSetCalendarIdsForCheckConflicts(selectedCalendarIds);
  }, [selectedCalendarIds, debouncedSetCalendarIdsForCheckConflicts]);

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>Check for conflicts</CardTitle>
        <CardDescription>
          Set the calendar(s) to check for conflicts to prevent double bookings.
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-col gap-4 pt-4">
        {calendarsByEmail.map(({ email, calendars }) => (
          <div key={email}>
            <p className="text-small-regular text-neutral-500">{email}</p>
            {calendars.map((calendar) => {
              const id = getCalendarUniqueId(email, calendar.id);
              return (
                <div className="flex items-center space-x-2 px-4 py-2" key={id}>
                  <Checkbox
                    checked={selectedCalendarIds.includes(id)}
                    id={id}
                    onCheckedChange={(checked) =>
                      handleCalendarChange(checked ? true : false, id)
                    }
                  />
                  <Label htmlFor="r1">{calendar.summary}</Label>
                </div>
              );
            })}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
