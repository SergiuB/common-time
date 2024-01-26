"use client";

import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { EventTypeValidation } from "@/lib/validations/event-type";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Check } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatMinutes, minutesFromString } from "@/lib/time";
import { useAuth } from "@clerk/nextjs";
import { colorVariants, eventColors } from "@/constants";
import { createEventType, updateEventType } from "@/lib/actions/user.actions";
import { EventTypeBadges } from "./EventTypeBadges";

type Action = "create" | "update";

interface Props {
  eventId?: string;
  name?: string;
  durationMin?: number;
  location?: string;
  description?: string;
  scheduleId?: string;
  link?: string;
  color?: number;
  beforeEventMin?: number;
  afterEventMin?: number;
  badges?: string;
  timezone?: string;
  action: Action;
  schedules: {
    id: string;
    name: string;
  }[];
}

const EventTypeForm = ({
  name,
  eventId,
  durationMin,
  location,
  description,
  scheduleId,
  link,
  color,
  beforeEventMin,
  afterEventMin,
  badges,
  timezone,
  action,
  schedules,
}: Props) => {
  const router = useRouter();
  const { userId } = useAuth();

  // TODO: maybe use react-hook-form-persist
  const form = useForm({
    resolver: zodResolver(EventTypeValidation),
    defaultValues: {
      name: name || "",
      durationMin:
        durationMin !== undefined ? formatMinutes(durationMin) : "30 min",
      location: location || "",
      description: description || "",
      color: color || 0,
      scheduleId: scheduleId || schedules[0].id,
      link: link || "test",
      beforeEventMin:
        beforeEventMin !== undefined ? formatMinutes(beforeEventMin) : "0 min",
      afterEventMin:
        afterEventMin !== undefined ? formatMinutes(afterEventMin) : "0 min",
      badges: badges || "",
      // tODO: timezone: get default from user profile
      timezone: timezone || "Europe/Bucharest",
    },
  });

  const onSubmit = async (values: z.infer<typeof EventTypeValidation>) => {
    const opts = {
      authId: userId!,
      name: values.name,
      durationMin: minutesFromString(values.durationMin),
      location: values.location,
      description: values.description,
      color: values.color,
      link: values.link,
      beforeEventMin: minutesFromString(values.beforeEventMin),
      afterEventMin: minutesFromString(values.afterEventMin),
      badges: values.badges,
      timezone: values.timezone,
      scheduleId: values.scheduleId,
    };
    if (action == "update") {
      await updateEventType({
        eventId: eventId!,
        ...opts,
      });
    }
    if (action == "create") {
      await createEventType({
        ...opts,
      });
    }
    router.push("/event-types");
  };

  // absolute top-0 left-0 right-0 flex items-center bg-white p-4 border-b
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className=" w-screen max-w-screen-md mt-20 grid grid-cols-4 gap-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="col-span-4">
              <FormLabel className="text-small-semibold">Name</FormLabel>
              <FormControl>
                <Input type="text" className="form-input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="durationMin"
          render={({ field }) => (
            <FormItem className="col-span-1">
              <FormLabel className="text-small-semibold">Duration</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="form-input">
                    <SelectValue placeholder="Select a duration" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="15 min">15 min</SelectItem>
                  <SelectItem value="30 min">30 min</SelectItem>
                  <SelectItem value="45 min">45 min</SelectItem>
                  <SelectItem value="1 hr">1 hr</SelectItem>
                  <SelectItem value="1 hr 30 min">1 hr 30 min</SelectItem>
                  <SelectItem value="2 hr">2 hr</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="beforeEventMin"
          render={({ field }) => (
            <FormItem className="col-span-1  col-start-3">
              <FormLabel className="text-small-semibold">
                Before event
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="form-input">
                    <SelectValue placeholder="Select a duration" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="0 min">0 min</SelectItem>
                  <SelectItem value="15 min">15 min</SelectItem>
                  <SelectItem value="30 min">30 min</SelectItem>
                  <SelectItem value="45 min">45 min</SelectItem>
                  <SelectItem value="1 hr">1 hr</SelectItem>
                  <SelectItem value="1 hr 30 min">1 hr 30 min</SelectItem>
                  <SelectItem value="2 hr">2 hr</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="afterEventMin"
          render={({ field }) => (
            <FormItem className="col-span-1">
              <FormLabel className="text-small-semibold">After event</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="form-input">
                    <SelectValue placeholder="Select a duration" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="0 min">0 min</SelectItem>
                  <SelectItem value="15 min">15 min</SelectItem>
                  <SelectItem value="30 min">30 min</SelectItem>
                  <SelectItem value="45 min">45 min</SelectItem>
                  <SelectItem value="1 hr">1 hr</SelectItem>
                  <SelectItem value="1 hr 30 min">1 hr 30 min</SelectItem>
                  <SelectItem value="2 hr">2 hr</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel className="text-small-semibold">Location</FormLabel>
              <FormControl>
                <Input type="text" className="form-input " {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="scheduleId"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel className="text-small-semibold">
                Availability
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="form-input">
                    <SelectValue placeholder="Select a schedule" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {schedules.map((schedule) => (
                    <SelectItem value={schedule.id} key={schedule.id}>
                      {schedule.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="col-span-4">
              <FormLabel className="text-small-semibold">Description</FormLabel>
              <FormControl>
                <Textarea rows={5} className="form-input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="badges"
          render={({ field }) => (
            <FormItem className="col-span-4">
              <FormLabel className="text-small-semibold">Badges</FormLabel>
              <FormControl>
                <Input type="text" className="form-input " {...field} />
              </FormControl>
              <FormMessage />
              {field.value.length ? (
                <EventTypeBadges badgeStr={field.value} />
              ) : null}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="timezone"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel className="text-small-semibold">Time zone</FormLabel>
              <Select
                disabled
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="form-input">
                    <SelectValue placeholder="Select a duration" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {/* TODO: timezone - populate list */}
                  <SelectItem value="Europe/Bucharest">
                    Eastern European Time
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem className="col-span-4">
              <FormLabel className="text-small-semibold">Color</FormLabel>
              <div className="flex flex-wrap gap-2 pb-4 hover">
                {eventColors.map((color, index) => (
                  <div
                    className="relative w-9 h-9 rounded-full text-center group cursor-pointer"
                    key={index}
                    style={{ backgroundColor: colorVariants[color] }}
                    onClick={() => field.onChange(index)}
                  >
                    {field.value === index && (
                      <Check className="text-white text-center h-8 w-8 pl-0.5 pt-1" />
                    )}
                    {field.value !== index ? (
                      <p className="relative top-8 text-subtle hidden group-hover:inline">
                        {color}
                      </p>
                    ) : (
                      <p className="relative text-subtle hidden group-hover:inline">
                        {color}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="col-start-3"></div>
        {form.formState.isDirty && (
          <Button type="submit" className="gap">
            {action === "create" ? "Create" : "Save"}
          </Button>
        )}
      </form>
    </Form>
  );
};

export default EventTypeForm;
