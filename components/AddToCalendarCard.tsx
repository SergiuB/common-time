"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { use, useCallback } from "react";
import { useForm } from "react-hook-form";
import { CalendarData } from "@/lib/types";

interface CalendarConfigurationCardProps {
  calendarsByEmail: { email: string; calendars: CalendarData[] }[];
}

export const AddToCalendarCard = ({
  calendarsByEmail,
}: CalendarConfigurationCardProps) => {
  const calendarData: CalendarData[] = [];
  const calendarIdToEmail: Record<string, string> = {};

  calendarsByEmail.forEach(({ email, calendars }) => {
    calendars.forEach((calendar) => {
      console.log(calendar);
      calendarData.push(calendar);
      calendarIdToEmail[calendar.id] = email;
    });
  });

  const handleCalendarChange = useCallback((calendarId: string) => {
    console.log("handleCalendarChange", calendarId);
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
        <RadioGroup defaultValue="none" onValueChange={handleCalendarChange}>
          {calendarsByEmail.map(({ email, calendars }) => (
            <div key={email}>
              <p className="text-small-regular text-neutral-500">{email}</p>
              {calendars
                .filter(({ accessRole }) =>
                  ["owner", "writer"].includes(accessRole),
                )
                .map((calendar) => (
                  <div
                    className="flex items-center space-x-2 px-4 py-2"
                    key={calendar.id}
                  >
                    <RadioGroupItem value={calendar.id} id={calendar.id} />
                    <Label htmlFor="r1">{calendar.summary}</Label>
                  </div>
                ))}
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
