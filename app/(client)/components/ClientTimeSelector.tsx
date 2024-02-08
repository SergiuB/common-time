"use client";

import { minutesToTime } from "@/lib/time";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { BookingValidation } from "@/lib/validations/booking";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  UserData,
  UserDataConsumer,
} from "@/app/(client)/components/UserDataProvider";
import { createEvent } from "@/lib/actions/calendar.actions";
import { EventType } from "@/lib/models/types";
import { DescriptionMarkdown } from "@/components/DescriptionMarkdown";
import { Textarea } from "@/components/ui/textarea";

interface ClientEventType
  extends Pick<EventType, "name" | "description" | "colorId"> {
  id: string;
}

interface Props {
  daySlots: [number, number][];
  eventType: ClientEventType;
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
  eventType: ClientEventType;
  selectedDay: Date;
}

const Slot = ({ startMin, endMin, eventType, selectedDay }: SlotProps) => {
  const form = useForm({
    resolver: zodResolver(BookingValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      comment: "",
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

        createEvent(userData.id, calendarAccountEmail, calendarId, {
          title: `${userData.fullName} and ${values.name}`,
          startDate: new Date(selectedDay.setHours(startHour, startMinute)),
          endDate: new Date(selectedDay.setHours(endHour, endMinute)),
          colorId: eventType.colorId,
          attendeeName: values.name,
          attendeeEmail: values.email,
          attendeeComment: values.comment,
          userId: userData.id,
          calendarAccountEmail,
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
              <DialogDescription>
                <DescriptionMarkdown>
                  {eventType.description}
                </DescriptionMarkdown>
              </DialogDescription>
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
                <FormField
                  control={form.control}
                  name="comment"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-4 items-center gap-4 mb-4">
                      <FormLabel className="">Comments</FormLabel>
                      <FormControl>
                        <Textarea rows={5} className="col-span-3" {...field} />
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
