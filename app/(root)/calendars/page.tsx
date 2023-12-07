import { getAllCalendarEmails } from "@/lib/actions/user.actions";
import { Plus, Trash } from "lucide-react";
import Link from "next/link";
import { getCalendars } from "@/lib/actions/calendar.actions";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { CalendarAccountsCard } from "@/components/CalendarAccountsCard";
import { AddToCalendarCard } from "@/components/AddToCalendarCard";

const Page = async () => {
  const calendarEmails = await getAllCalendarEmails();

  const calendarsPromises = calendarEmails.map(getCalendars);

  const calendars = await Promise.all(calendarsPromises);

  const calendarsByEmail = calendarEmails.map((email, index) => ({
    email,
    calendars: calendars[index],
  }));

  return (
    <section className="flex flex-col gap-8">
      <CalendarAccountsCard accountEmails={calendarEmails} />

      <AddToCalendarCard calendarsByEmail={calendarsByEmail} />
    </section>
  );
};

export default Page;
