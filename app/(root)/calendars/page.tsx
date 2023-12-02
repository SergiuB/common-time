import { getAllCalendarEmails } from "@/lib/actions/user.actions";
import { Plus } from "lucide-react";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs";
import { getCalendars } from "@/lib/actions/calendar.actions";

const GOOGLE_OAUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const REDIRECT_URI = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI; // e.g., 'http://localhost:3000/api/auth/callback'
const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const SCOPES = "email https://www.googleapis.com/auth/calendar";

const GOOGLE_OAUTH_FULL_URL = `${GOOGLE_OAUTH_URL}?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
  REDIRECT_URI!,
)}&scope=${encodeURIComponent(SCOPES)}&access_type=offline&prompt=consent`;

const Page = async () => {
  const calendarEmails = await getAllCalendarEmails();

  const calendarsPromises = calendarEmails.map(getCalendars);

  const calendars = (await Promise.all(calendarsPromises)).flat();
  return (
    <section>
      <Link href={GOOGLE_OAUTH_FULL_URL}>
        <Plus className="h-4 w-4" />
        <p className="text-small-regular">Add Google Calendar Account</p>
      </Link>
      {calendars.map((calendar, index) => (
        <div key={index}>
          <p>{calendar.summary}</p>
        </div>
      ))}
    </section>
  );
};

export default Page;
