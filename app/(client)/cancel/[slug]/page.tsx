import { getEventData } from "@/lib/actions/calendar.actions";
import { decryptSafeUrlPart } from "@/lib/actions/crypto.actions";
import { CancelForm } from "./components/CancelForm";

interface Props {
  params: {
    slug: string;
  };
}

const CancelPage = async ({ params: { slug } }: Props) => {
  const cancelToken = slug;
  const cancelData = await decryptSafeUrlPart(
    cancelToken,
    process.env.CANCEL_SECRET_KEY!,
  );

  const [userId, calendarAccountEmail, calendarId, eventId] =
    cancelData.split("::");

  const eventData = await getEventData(
    userId,
    calendarAccountEmail,
    calendarId,
    eventId,
  );
  if (!eventData) {
    return <div>Event not found</div>;
  }

  return (
    <CancelForm
      userId={userId}
      calendarAccountEmail={calendarAccountEmail}
      calendarId={calendarId}
      eventData={eventData}
    />
  );
};

export default CancelPage;
