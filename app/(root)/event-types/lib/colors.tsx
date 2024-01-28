import { fetchEventColors } from "@/lib/actions/calendar.actions";
import { getCalendarIdForAdd } from "@/lib/actions/user.actions";

export async function getColors() {
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
