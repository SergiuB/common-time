import {
  getAllCalendarAccountEmails,
  getCalendarIdForAdd,
  getCalendarIdsForCheckConflicts,
} from "@/lib/actions/user.actions";
import { getCalendars } from "@/lib/actions/calendar.actions";
import { CalendarData } from "@/lib/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, HeartHandshake } from "lucide-react";
import { CalendarAccountsCard } from "@/app/(root)/calendars/components/CalendarAccountsCard";
import { AddToCalendarCard } from "@/app/(root)/calendars/components/AddToCalendarCard";
import { CheckForConflictsCard } from "@/app/(root)/calendars/components/CheckForConflictsCard";

const FailedAuthAlert = (
  <Alert variant="destructive">
    <AlertCircle className="h-4 w-4" />
    <AlertTitle>Heads up!</AlertTitle>
    <AlertDescription>
      You have accounts with failed authentication/authorization. Please remove
      or reauth them.
    </AlertDescription>
  </Alert>
);

const NoAccountsAlert = (
  <Alert>
    <HeartHandshake className="h-4 w-4" />
    <AlertTitle>Hello there!</AlertTitle>
    <AlertDescription>
      You should really add some Google Calendar accounts to get started.
    </AlertDescription>
  </Alert>
);
const Page = async () => {
  const accountEmails = await getAllCalendarAccountEmails();

  const calendarsPromises = accountEmails.map(async (email) => {
    try {
      const calendarData = await getCalendars(email);
      return calendarData;
    } catch (error) {
      console.error(error);
      return "failed_auth";
    }
  });

  const calendarsForAllAccounts = await Promise.all(calendarsPromises);

  const accountData = accountEmails.map((email, index) => {
    const calendars = calendarsForAllAccounts[index];
    if (calendars === "failed_auth") {
      return {
        email,
        failedAuth: true,
      };
    }
    return {
      email,
      calendars,
      failedAuth: false,
    };
  });

  const hasAccountsWithFailedAuth = accountData.some(
    ({ failedAuth }) => failedAuth,
  );

  const validAccountData = accountData.filter(
    ({ failedAuth, calendars }) => !failedAuth && calendars?.length,
  ) as {
    email: string;
    calendars: CalendarData[];
  }[];

  const calendarIdForAdd = await getCalendarIdForAdd();
  const calendarIdsForCheckConflicts = await getCalendarIdsForCheckConflicts();

  return (
    <section className="flex flex-col gap-8 max-w-xl">
      <CalendarAccountsCard accountData={accountData} />
      {hasAccountsWithFailedAuth ? (
        FailedAuthAlert
      ) : validAccountData.length ? (
        <>
          <AddToCalendarCard
            calendarsByAccountEmail={validAccountData}
            calendarId={calendarIdForAdd}
          />

          <CheckForConflictsCard
            calendarsByAccountEmail={validAccountData}
            calendarIds={calendarIdsForCheckConflicts}
          />
        </>
      ) : (
        NoAccountsAlert
      )}
    </section>
  );
};

export default Page;
