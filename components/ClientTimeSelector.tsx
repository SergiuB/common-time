"use client";

import { minutesToTime } from "@/lib/time";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { BookingValidation } from "@/lib/validations/booking";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { UserData, UserDataConsumer } from "./UserDataProvider";
import { createEvent } from "@/lib/actions/calendar.actions";

interface EventType {
  id: string;
  name: string;
  durationMin: number;
  beforeEventMin: number;
  afterEventMin: number;
  color: number;

  description: string;
  location: string;
  scheduleId: string;
}

interface Props {
  daySlots: [number, number][];
  eventType: EventType;
  selectedDay: Date;
}

export const ClientTimeSelector = ({
  daySlots,
  eventType,
  selectedDay,
}: Props) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {daySlots.map(([startMin, endMin]) => (
        <Slot
          key={startMin}
          startMin={startMin}
          endMin={endMin}
          eventType={eventType}
          selectedDay={selectedDay}
        />
      ))}
    </div>
  );
};

interface SlotProps {
  startMin: number;
  endMin: number;
  eventType: EventType;
  selectedDay: Date;
}

const Slot = ({ startMin, endMin, eventType, selectedDay }: SlotProps) => {
  const form = useForm({
    resolver: zodResolver(BookingValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  const onSubmit =
    (userData: UserData) =>
    async (values: z.infer<typeof BookingValidation>) => {
      if (userData.calendarIdForAdd) {
        const [calendarAccountEmail, calendarId] =
          userData.calendarIdForAdd.split("::") ?? [];

        const [startHour, startMinute] = minutesToTime(startMin)
          .split(":")
          .map(Number);
        const [endHour, endMinute] = minutesToTime(endMin)
          .split(":")
          .map(Number);

        createEvent(calendarAccountEmail, calendarId, {
          title: `(${getInitials(userData.fullName)}) ${values.name}`,
          startDate: new Date(selectedDay.setHours(startHour, startMinute)),
          endDate: new Date(selectedDay.setHours(endHour, endMinute)),
        });
      }
    };

  return (
    <UserDataConsumer>
      {(userData) => (
        <Dialog>
          <DialogTrigger asChild>
            <div className="cursor-pointer border rounded-md border-neutral-300 h-12 flex justify-center items-center ">
              {`${minutesToTime(startMin)} - ${minutesToTime(endMin)}`}
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {userData.fullName} - {eventType.name}
              </DialogTitle>
              <DialogDescription>{eventType.description}</DialogDescription>
            </DialogHeader>
            <div className="border-l border-primary-500 border-l-4 rounded-sm p-2 bg-primary-200">
              <h2 className="text-body-bold mb-1">
                {selectedDay.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </h2>
              <p className="text-base-regular">{`${minutesToTime(
                startMin,
              )} - ${minutesToTime(endMin)}`}</p>
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit(userData))}
                className="flex flex-col"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-4 items-center gap-4 mb-4">
                      <FormLabel className="">Name</FormLabel>
                      <FormControl>
                        <Input className="col-span-3" {...field} />
                      </FormControl>
                      <FormMessage className="text-right col-span-4" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-4 items-center gap-4 mb-4">
                      <FormLabel className="">Email</FormLabel>
                      <FormControl>
                        <Input className="col-span-3" {...field} />
                      </FormControl>
                      <FormMessage className="text-right col-span-4" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-4 items-center gap-4 mb-4">
                      <FormLabel className="">Phone</FormLabel>
                      <FormControl>
                        <Input className="col-span-3" {...field} />
                      </FormControl>
                      <FormMessage className="text-right col-span-4" />
                    </FormItem>
                  )}
                />
                <Button className="justify-self-end" type="submit">
                  Book
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      )}
    </UserDataConsumer>
  );
};

function getInitials(fullName: string) {
  const [firstName, lastName] = fullName.split(" ");
  return lastName ? `${firstName[0]}${lastName[0]}` : firstName[0];
}
