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
import { Plus, CalendarCheck, X } from "lucide-react";
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
import { useCallback, useEffect, useRef, useState } from "react";
import { TimeSelect } from "@/components/TimeSelect";
import debounce from "lodash/debounce";
import { useToast } from "@/components/ui/use-toast";
import { has } from "lodash";
import { defaultEndMin, defaultStartMin } from "@/constants";

type Day =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

interface IntervalData {
  id: string;
  day: Day;
  startMin: number;
  endMin: number;
}
export interface ScheduleData {
  name: string;
  id: string;
  intervals: IntervalData[];
}

interface Props {
  userId: string;
  schedules: ScheduleData[];
}

export const ScheduleForm = ({ userId, schedules }: Props) => {
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
        {selectedSchedule ? (
          <ScheduleEditor
            schedule={selectedSchedule}
            onChange={handleScheduleChange}
          />
        ) : null}
      </div>
    </div>
  );
};

interface ScheduleEditorProps {
  schedule: ScheduleData;
  onChange: (schedule: ScheduleData) => void;
}

export const ScheduleEditor = ({ schedule, onChange }: ScheduleEditorProps) => {
  const canTriggerOnChange = useRef(false);
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

  const changeIntervalStart = (intervalId: string, minutes: number) => {
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
      return newState;
    });
  };
  const changeIntervalEnd = (intervalId: string, minutes: number) => {
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
      return newState;
    });
  };

  const addInterval = (day: Day) => {
    setScheduleState((state) => {
      const lastInterval = getLastIntervalForDay(state.intervals, day);

      const startMin = lastInterval
        ? (lastInterval.endMin + 60) % (60 * 24)
        : defaultStartMin;
      const endMin = lastInterval ? (startMin + 60) % (60 * 24) : defaultEndMin;

      const newState = {
        ...state,
        intervals: [
          ...state.intervals,
          {
            id: Math.random().toString(),
            day: day,
            startMin,
            endMin,
          },
        ],
      };
      return newState;
    });
  };

  const removeInterval = (intervalId: string) => {
    setScheduleState((state) => {
      const newState = {
        ...state,
        intervals: state.intervals.filter(
          (interval) => interval.id !== intervalId,
        ),
      };
      return newState;
    });
  };

  const removeIntervalsForDay = (day: Day) => {
    setScheduleState((state) => {
      const newState = {
        ...state,
        intervals: state.intervals.filter((interval) => interval.day !== day),
      };
      return newState;
    });
  };

  const debouncedOnChange = useCallback(
    debounce((schedule: ScheduleData) => {
      onChange(schedule);
    }, 1000),
    [],
  );

  useEffect(() => {
    if (canTriggerOnChange.current) {
      debouncedOnChange(scheduleState);
    } else {
      canTriggerOnChange.current = true;
    }
  }, [scheduleState, debouncedOnChange]);

  useEffect(() => {
    canTriggerOnChange.current = false;
    setScheduleState(schedule);
  }, [schedule]);

  return (
    <div className="flex flex-col gap-8 p-4">
      {Object.entries(intervalData).map((intervalEntry) => {
        const day = intervalEntry[0] as Day;
        const dayIntervals = intervalEntry[1];
        return (
          <div key={day} className="flex flex-row items-start gap-8">
            <div className="w-12 flex flex-row space-x-2 pt-2.5">
              <Checkbox
                id="terms"
                checked={Object.entries(dayIntervals).length > 0}
                onCheckedChange={(checked) => {
                  if (checked) {
                    addInterval(day);
                  } else {
                    removeIntervalsForDay(day);
                  }
                }}
              />
              <label
                htmlFor="terms"
                className="text-small-semibold text-neutral-700"
              >
                {day.toUpperCase().slice(0, 3)}
              </label>
            </div>

            {Object.entries(dayIntervals).length > 0 && (
              <div className="flex flex-col gap-2  ">
                {Object.entries(dayIntervals).map(
                  ([intervalId, { startMin, endMin }], index) => (
                    <div
                      key={index}
                      className="w-60 flex flex-row items-center  gap-2"
                    >
                      <div>
                        <TimeSelect
                          minutes={startMin}
                          onChange={(min) =>
                            changeIntervalStart(intervalId, min)
                          }
                        />
                      </div>
                      <p>-</p>
                      <div>
                        <TimeSelect
                          minutes={endMin}
                          onChange={(min) => changeIntervalEnd(intervalId, min)}
                        />
                      </div>
                      <Button
                        variant="ghost"
                        className=""
                        onClick={() => removeInterval(intervalId)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ),
                )}
              </div>
            )}

            {Object.entries(dayIntervals).length === 0 && (
              <p className="w-60 pt-2 text-base-regular text-neutral-400 ">
                Unavailable
              </p>
            )}

            <Button
              variant="outline"
              className="rounded-full ml-4"
              onClick={() => addInterval(day)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        );
      })}
    </div>
  );
};

const getLastIntervalForDay = (intervals: IntervalData[], day: Day) => {
  const intervalsForDay = intervals
    .filter((interval) => interval.day === day)
    .sort((a, b) => a.startMin - b.startMin);
  return intervalsForDay[intervalsForDay.length - 1];
};
