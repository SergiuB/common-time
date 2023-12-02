"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";
import { createSchedule, fetchSchedules } from "@/lib/actions/user.actions";
import { ScheduleCollection } from "@/lib/models/types";
import { currentUser } from "@clerk/nextjs";
import { Plus, CalendarCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ScheduleValidation } from "@/lib/validations/schedule";
import { useState } from "react";
import { days } from "@/constants";
import { TimeSelect } from "./TimeSelect";

type Day =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export interface ScheduleData {
  name: string;
  id: string;
  intervals: {
    day: Day;
    startMin: number;
    endMin: number;
  }[];
}

interface Props {
  userId: string;
  schedules: ScheduleData[];
}

export const ScheduleForm = ({ userId, schedules }: Props) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(schedules[0]?.id || null);

  const form = useForm({
    resolver: zodResolver(ScheduleValidation),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (values: z.infer<typeof ScheduleValidation>) => {
    createSchedule({ authId: userId, name: values.name });
    setOpen(false);
  };

  const selectedSchedule = schedules.find(
    (schedule) => schedule.id === selected,
  )!;

  const intervalData = selectedSchedule?.intervals.reduce(
    (acc, interval) => {
      const day = interval.day;
      const startMin = interval.startMin;
      const endMin = interval.endMin;

      acc[day].push({
        startMin,
        endMin,
      });

      return acc;
    },
    {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
      Sunday: [],
    } as Record<Day, { startMin: number; endMin: number }[]>,
  );

  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        {schedules.map(({ name, id }) => (
          <Button variant="outline" key={id} onClick={() => setSelected(id)}>
            {selected === id ? (
              <>
                <CalendarCheck className="h-4 w-4 mr-2 text-indigo-600" />
                <p className="text-base-semibold">{name}</p>
              </>
            ) : (
              <>
                <CalendarCheck className="h-4 w-4 mr-2" />
                <p className="text-base-regular">{name}</p>
              </>
            )}
          </Button>
        ))}

        <Dialog onOpenChange={setOpen} open={open}>
          <DialogTrigger asChild>
            <Button variant="outline" className="rounded-3xl">
              <Plus className="h-4 w-4" />
              <p className="text-small-regular">New Schedule</p>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>New schedule</DialogTitle>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-small-semibold">
                        Name
                      </FormLabel>
                      <FormControl>
                        <Input type="text" className="form-input" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="float-right mt-4">
                  Create
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border w-full bg-white rounded-lg">
        {selectedSchedule && (
          <div className="flex flex-col gap-8 p-4">
            {Object.entries(intervalData).map(([day, dayIntervals]) => (
              <div key={day} className="flex flex-row gap-4">
                <div className="flex flex-row items-center space-x-2">
                  <Checkbox id="terms" checked={dayIntervals.length > 0} />
                  <label
                    htmlFor="terms"
                    className="text-small-semibold text-neutral-700"
                  >
                    {day.toUpperCase().slice(0, 3)}
                  </label>
                </div>

                {dayIntervals.length > 0 && (
                  <div className="flex flex-row gap-2">
                    {dayIntervals.map(({ startMin, endMin }, index) => (
                      <div
                        key={index}
                        className="flex flex-row items-center space-x-2"
                      >
                        {/* <p className="text-sm font-medium leading-none">
                          {startMin} - {endMin}
                        </p> */}
                        <TimeSelect minutes={startMin} />
                        -
                        <TimeSelect minutes={endMin} />
                      </div>
                    ))}
                  </div>
                )}

                {dayIntervals.length === 0 && (
                  <p className="text-base-regular text-neutral-400">
                    Unavailable
                  </p>
                )}

                <Button variant="outline" className="rounded-full">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
