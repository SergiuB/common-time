import { currentUser } from "@clerk/nextjs";

import EventTypeForm from "@/components/EventTypeForm";
import { fetchEventType } from "@/lib/actions/user.actions";
import { EventTypeTopBar } from "@/components/EventTypeTopBar";

const Page = async ({ params }: { params: { id: string } }) => {
  const user = await currentUser();
  const eventType = await fetchEventType({
    authId: user!.id,
    eventId: params.id,
  });

  return (
    <section className="flex flex-col items-center">
      <EventTypeTopBar title="Edit Event Type" />

      <EventTypeForm
        action="update"
        eventId={eventType._id!.toString()}
        name={eventType.name}
        durationMin={eventType.durationMin}
        location={eventType.location}
        description={eventType.description}
        scheduleId={eventType.scheduleId.toString()}
        link={eventType.link}
        color={eventType.color}
        dateRangeDays={eventType.dateRangeDays}
        beforeEventMin={eventType.beforeEventMin}
        afterEventMin={eventType.afterEventMin}
      />
    </section>
  );
};

export default Page;
