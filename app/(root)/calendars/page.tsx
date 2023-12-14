import {
  getAllCalendarAccountEmails,
  getCalendarIdForAdd,
  getCalendarIdsForCheckConflicts,
} from "@/lib/actions/user.actions";
import { getCalendars } from "@/lib/actions/calendar.actions";
import { CalendarAccountsCard } from "@/components/CalendarAccountsCard";
import { AddToCalendarCard } from "@/components/AddToCalendarCard";
import { CheckForConflictsCard } from "@/components/CheckForConflictsCard";
import { CalendarData } from "@/lib/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const Page = async () => {
  const accountEmails = await getAllCalendarAccountEmails();

  const calendarsPromises = accountEmails.map(async (email) => {
    try {
      return await getCalendars(email);
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
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>
            You have accounts with failed authentication/authorization. Please
            remove or reauth them.
          </AlertDescription>
        </Alert>
      ) : (
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
      )}
    </section>
  );
};

export default Page;
