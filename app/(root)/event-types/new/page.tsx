import EventTypeForm from "../components/EventTypeForm";
import { EventTypeTopBar } from "../components/EventTypeTopBar";
import { fetchSchedules } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { getColors } from "../lib/colors";

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

export default Page;
