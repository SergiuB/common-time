"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";
import { createSchedule, updateSchedule } from "@/lib/actions/user.actions";
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
import { useCallback, useEffect, useState } from "react";
import { TimeSelect } from "@/components/TimeSelect";
import debounce from "lodash/debounce";
import { useToast } from "@/components/ui/use-toast";

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
    id: string;
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
  console.log("fgfg");
  const { toast } = useToast();
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

  const handleScheduleChange = async (schedule: ScheduleData) => {
    updateSchedule({
      scheduleId: schedule.id,
      name: schedule.name,
      intervals: schedule.intervals.map((interval) => ({
        day: interval.day,
        startMin: interval.startMin,
        endMin: interval.endMin,
      })),
    });
    console.log("hello");
    toast({
      title: "Schedule updated",
      duration: 3000,
    });
  };

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
          <ScheduleEditor
            schedule={selectedSchedule}
            onChange={handleScheduleChange}
          />
        )}
      </div>
    </div>
  );
};

interface ScheduleEditorProps {
  schedule: ScheduleData;
  onChange: (schedule: ScheduleData) => void;
}

export const ScheduleEditor = ({ schedule, onChange }: ScheduleEditorProps) => {
  const [scheduleState, setScheduleState] = useState({
    ...schedule,
    intervals: schedule.intervals.map((interval) => ({
      ...interval,
      startMin: interval.startMin,
      endMin: interval.endMin,
    })),
  });

  const intervalData = scheduleState.intervals.reduce(
    (acc, interval) => {
      const day = interval.day;
      const startMin = interval.startMin;
      const endMin = interval.endMin;

      acc[day][interval.id] = {
        startMin,
        endMin,
      };

      return acc;
    },
    {
      Monday: {},
      Tuesday: {},
      Wednesday: {},
      Thursday: {},
      Friday: {},
      Saturday: {},
      Sunday: {},
    } as Record<Day, Record<string, { startMin: number; endMin: number }>>,
  );

  const handleStartChange = (intervalId: string, minutes: number) => {
    setScheduleState((state) => {
      const newState = {
        ...state,
        intervals: state.intervals.map((interval) =>
          interval.id === intervalId
            ? {
                ...interval,
                startMin: minutes,
              }
            : interval,
        ),
      };
      debouncedOnChange(newState);
      return newState;
    });
  };
  const handleEndChange = (intervalId: string, minutes: number) => {
    setScheduleState((state) => {
      const newState = {
        ...state,
        intervals: state.intervals.map((interval) =>
          interval.id === intervalId
            ? {
                ...interval,
                endMin: minutes,
              }
            : interval,
        ),
      };
      debouncedOnChange(newState);
      return newState;
    });
  };

  const debouncedOnChange = useCallback(
    debounce((schedule: ScheduleData) => {
      onChange(schedule);
    }, 1000),
    [onChange],
  );

  return (
    <div className="flex flex-col gap-8 p-4">
      {Object.entries(intervalData).map(([day, dayIntervals]) => (
        <div key={day} className="flex flex-row items-center gap-4">
          <div className="w-12 flex flex-row items-center space-x-2">
            <Checkbox
              id="terms"
              checked={Object.entries(dayIntervals).length > 0}
            />
            <label
              htmlFor="terms"
              className="text-small-semibold text-neutral-700"
            >
              {day.toUpperCase().slice(0, 3)}
            </label>
          </div>

          {Object.entries(dayIntervals).length > 0 && (
            <div className="flex flex-row gap-2">
              {Object.entries(dayIntervals).map(
                ([intervalId, { startMin, endMin }], index) => (
                  <div
                    key={index}
                    className="w-52 flex flex-row items-center space-x-2"
                  >
                    <TimeSelect
                      minutes={startMin}
                      onChange={(min) => handleStartChange(intervalId, min)}
                    />
                    <p>-</p>
                    <TimeSelect
                      minutes={endMin}
                      onChange={(min) => handleEndChange(intervalId, min)}
                    />
                  </div>
                ),
              )}
            </div>
          )}

          {Object.entries(dayIntervals).length === 0 && (
            <p className="w-52 text-base-regular text-neutral-400 ">
              Unavailable
            </p>
          )}

          <Button variant="outline" className="rounded-full">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};
