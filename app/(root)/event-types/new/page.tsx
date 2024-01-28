import EventTypeForm from "../components/EventTypeForm";
import { EventTypeTopBar } from "../components/EventTypeTopBar";
import { fetchSchedules } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { fetchEventColors } from "@/lib/actions/calendar.actions";
import { getCalendarIdForAdd } from "@/lib/actions/user.actions";

const Page = async () => {
  const user = await currentUser();
  const schedules = (await fetchSchedules({ authId: user!.id })).map(
    (schedule) => ({
      name: schedule.name,
      id: schedule._id!.toString(),
    }),
  );

  const colors = await getColors();

  return (
    <section className="flex flex-col items-center">
      <EventTypeTopBar title="New Event Type" />

      <EventTypeForm action="create" schedules={schedules} colors={colors} />
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
