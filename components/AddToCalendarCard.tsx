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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { use, useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { CalendarData, getCalendarUniqueId } from "@/lib/types";
import { setCalendarIdForAdd } from "@/lib/actions/user.actions";

interface CalendarConfigurationCardProps {
  calendarsByEmail: { email: string; calendars: CalendarData[] }[];
  calendarId: string;
}

export const AddToCalendarCard = ({
  calendarsByEmail,
  calendarId,
}: CalendarConfigurationCardProps) => {
  const handleCalendarChange = useCallback((calendarId: string) => {
    setCalendarIdForAdd(calendarId);
  }, []);

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>Add to calendar</CardTitle>
        <CardDescription>
          Which calendar should we add new events to?
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-col gap-4 pt-4">
        <RadioGroup
          defaultValue={calendarId || "none"}
          onValueChange={handleCalendarChange}
        >
          {calendarsByEmail.map(({ email, calendars }) => (
            <div key={email}>
              <p className="text-small-regular text-neutral-500">{email}</p>
              {calendars
                .filter(({ accessRole }) =>
                  ["owner", "writer"].includes(accessRole),
                )
                .map((calendar) => {
                  const id = getCalendarUniqueId(email, calendar.id);
                  return (
                    <div
                      className="flex items-center space-x-2 px-4 py-2"
                      key={id}
                    >
                      <RadioGroupItem value={id} id={id} />
                      <Label htmlFor="r1">{calendar.summary}</Label>
                    </div>
                  );
                })}
            </div>
          ))}

          <div className="flex items-center space-x-2">
            <RadioGroupItem value="none" id="none" />
            <Label htmlFor="r1">Do not add new events to a calendar</Label>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
};
