import { ScheduleForm, ScheduleData } from "@/components/ScheduleForm";
import { fetchSchedules } from "@/lib/actions/user.actions";
import { Schedule } from "@/lib/models/types";
import { currentUser } from "@clerk/nextjs";

const toSchedulePojo = (schedule: Schedule): ScheduleData => ({
  name: schedule.name,
  id: schedule._id!.toString(),
  intervals: schedule.intervals.map((interval) => ({
    id: interval._id!.toString(),
    day: interval.day,
    startMin: interval.startMin,
    endMin: interval.endMin,
  })),
});

const Page = async () => {
  const user = await currentUser();
  const schedules = await fetchSchedules({
    authId: user!.id,
  });

  return (
    <section>
      <ScheduleForm
        userId={user!.id}
        schedules={schedules.map(toSchedulePojo)}
      ></ScheduleForm>
    </section>
  );
};

export default Page;
