import { currentUser } from "@clerk/nextjs";

import EventTypeForm from "../components/EventTypeForm";
import {
  fetchEventType,
  fetchSchedules,
  getCalendarIdForAdd,
} from "@/lib/actions/user.actions";
import { EventTypeTopBar } from "../components/EventTypeTopBar";
import { fetchEventColors } from "@/lib/actions/calendar.actions";

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

  const colors = await getColors();

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
        colorId={eventType.colorId}
        beforeEventMin={eventType.beforeEventMin}
        afterEventMin={eventType.afterEventMin}
        badges={eventType.badges}
        timezone={eventType.timezone}
        schedules={schedules}
        colors={colors}
      />
    </section>
  );
};

async function getColors() {
  const calendarIdForAdd = await getCalendarIdForAdd();
  const [calendarAccountEmail] = (calendarIdForAdd ?? "").split("::") ?? [];
  const colorObj = calendarAccountEmail
    ? await fetchEventColors(calendarAccountEmail)
    : {};

  return Object.entries(colorObj).map(([key, value]) => ({
    id: key,
    color: value.background,
  }));
}

export default Page;
