import colors from "tailwindcss/colors";

interface Props {}

export const generateSidebarLinks = () => [
  {
    imgURL: "/assets/event-types.svg",
    route: "/event-types",
    label: "Event Types",
  },
  {
    imgURL: "/assets/schedule.svg",
    route: "/availability",
    label: "Availability",
  },
  {
    imgURL: "/assets/calendar.svg",
    route: "/calendars",
    label: "Calendars",
  },
  {
    imgURL: "/assets/profile.svg",
    route: `/profile`,
    label: "Profile",
  },
];

export const eventColors = [
  "red",
  "orange",
  "amber",
  "yellow",
  "lime",
  "green",
  "emerald",
  "teal",
  "cyan",
  "sky",
  "blue",
  "indigo",
  "violet",
  "purple",
  "fuchsia",
  "pink",
  "rose",
];

export const colorVariants: {
  [key: string]: string;
} = {
  red: colors.red["500"],
  orange: colors.orange["500"],
  amber: colors.amber["500"],
  yellow: colors.yellow["500"],
  lime: colors.lime["500"],
  green: colors.green["500"],
  emerald: colors.emerald["500"],
  teal: colors.teal["500"],
  cyan: colors.cyan["500"],
  sky: colors.sky["500"],
  blue: colors.blue["500"],
  indigo: colors.indigo["500"],
  violet: colors.violet["500"],
  purple: colors.purple["500"],
  fuchsia: colors.fuchsia["500"],
  pink: colors.pink["500"],
  rose: colors.rose["500"],
};

export const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export const defaultStartMin = 9 * 60;
export const defaultEndMin = 17 * 60;

export const EVENT_STEP_MIN = 30;
