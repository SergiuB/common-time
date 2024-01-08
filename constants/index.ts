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

export const DAY_NAMES = [
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

export const REDIRECT_URI = `${
  process.env.NEXT_PUBLIC_VERCEL_ENV === "development" ? "http" : "https"
}://${process.env.NEXT_PUBLIC_VERCEL_URL}/calendars/auth`;

export const GOOGLE_OAUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";

export const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
export const SCOPES = "email https://www.googleapis.com/auth/calendar";

export const GOOGLE_OAUTH_FULL_URL = `${GOOGLE_OAUTH_URL}?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
  REDIRECT_URI!,
)}&scope=${encodeURIComponent(SCOPES)}&access_type=offline&prompt=consent`;
