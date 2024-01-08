import { ClientSelector } from "@/components/ClientSelector";
import { UserDataProvider } from "@/components/UserDataProvider";
import { Card, CardContent } from "@/components/ui/card";
import { getUserDataFromLink } from "@/lib/actions/user.actions";

interface Props {
  params: {
    slug: string;
  };
}

const BookingPage = async ({ params: { slug } }: Props) => {
  const { userData, eventTypes, busyIntervals, schedules } =
    await getUserDataFromLink(slug);
  if (!userData) {
    // TOFO: 404 page
    return <div>Not found</div>;
  }

  const selectedEventTypeId = eventTypes[0].id;

  return (
    <Card>
      <CardContent className="pt-4">
        <UserDataProvider userData={userData}>
          <ClientSelector
            busyIntervals={busyIntervals}
            eventTypes={eventTypes}
            defaultEventTypeId={selectedEventTypeId}
            schedules={schedules}
          />
        </UserDataProvider>
      </CardContent>
    </Card>
  );
};

export default BookingPage;
