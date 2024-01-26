import { currentUser } from "@clerk/nextjs";

import EventTypeForm from "@/components/EventTypeForm";
import { fetchEventType, fetchSchedules } from "@/lib/actions/user.actions";
import { EventTypeTopBar } from "@/components/EventTypeTopBar";

const Page = async ({ params }: { params: { id: string } }) => {
  const user = await currentUser();
  const eventType = await fetchEventType({
    authId: user!.id,
    eventId: params.id,
  });
  const schedules = (await fetchSchedules({ authId: user!.id })).map(
    (schedule) => ({
      name: schedule.name,
      id: schedule._id!.toString(),
    }),
  );

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
        beforeEventMin={eventType.beforeEventMin}
        afterEventMin={eventType.afterEventMin}
        badges={eventType.badges}
        timezone={eventType.timezone}
        schedules={schedules}
      />
    </section>
  );
};

export default Page;
