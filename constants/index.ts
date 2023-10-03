interface Props {
  userId?: string | null;
}

export const generateSidebarLinks = ({ userId }: Props) => [
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
    route: `/profile/${userId}`,
    label: "Profile",
  },
];
