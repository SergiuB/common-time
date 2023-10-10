"use client";

import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { EventTypeValidation } from "@/lib/validations/event-type";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";

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
import { formatMinutes, minutesFromString } from "@/lib/utils";
import { useAuth } from "@clerk/nextjs";
import { createEventType } from "@/lib/actions/event-type.actions";

type Action = "create" | "update";

interface Props {
  name?: string;
  durationMin?: number;
  location?: string;
  description?: string;
  scheduleId?: string;
  link?: string;
  color?: number;
  dateRangeDays?: number;
  beforeEventMin?: number;
  afterEventMin?: number;
  action: Action;
}

const EventTypeForm = ({
  name,
  durationMin,
  location,
  description,
  scheduleId,
  link,
  color,
  dateRangeDays,
  beforeEventMin,
  afterEventMin,
  action,
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
      scheduleId: scheduleId || "",
      link: link || "test",
      dateRangeDays: dateRangeDays || 60,
      beforeEventMin:
        beforeEventMin !== undefined ? formatMinutes(beforeEventMin) : "0 min",
      afterEventMin:
        afterEventMin !== undefined ? formatMinutes(afterEventMin) : "0 min",
    },
  });

  const onSubmit = async (values: z.infer<typeof EventTypeValidation>) => {
    console.log("submitting", values);
    // TODO: create or update event type
    await createEventType({
      authId: userId!,
      name: values.name,
      durationMin: minutesFromString(values.durationMin),
      location: values.location,
      description: values.description,
      color: values.color,
      link: values.link,
      dateRangeDays: values.dateRangeDays,
      beforeEventMin: minutesFromString(values.beforeEventMin),
      afterEventMin: minutesFromString(values.afterEventMin),
    });

    router.push("/event-types");
  };

  const onInvalid = (...args: any[]) => {
    console.log(args);
  };

  // absolute top-0 left-0 right-0 flex items-center bg-white p-4 border-b
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onInvalid)}
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
          name="dateRangeDays"
          render={({ field }) => (
            <FormItem className="col-span-1">
              <FormLabel className="text-small-semibold">Date Range</FormLabel>
              <div className="flex items-center gap-2">
                <FormControl>
                  <Input
                    type="number"
                    className="form-input "
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value, 10))
                    }
                  />
                </FormControl>
                <p className="text-subtle-semibold">days into the future</p>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="beforeEventMin"
          render={({ field }) => (
            <FormItem className="col-span-1">
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
            <FormItem className="col-span-4">
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

        <div className="col-span-3"></div>
        <Button type="submit" className="gap">
          {action === "create" ? "Create" : "Save"}
        </Button>
      </form>
    </Form>
  );
};

export default EventTypeForm;