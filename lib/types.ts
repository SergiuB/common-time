export interface CalendarData {
  id: string;
  summary: string;
  description: string;
  timeZone: string;
  backgroundColor: string;
  foregroundColor: string;
  accessRole: "reader" | "writer" | "owner";
}

export const getCalendarUniqueId = (accountEmail: string, calendarId: string) =>
  `${accountEmail}::${calendarId}`;
