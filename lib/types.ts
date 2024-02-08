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

export interface CalendarEvent {
  id: string;
  status: "confirmed" | "tentative" | "cancelled";
  summary: string;
  description: string;
  location: string;
  colorId: string;
  start: {
    dateTime: string;
  };
  end: {
    dateTime: string;
  };
  attendees: [
    {
      email: string;
      displayName: string;
      responseStatus: "needsAction" | "declined" | "tentative" | "accepted";
      comment: string;
    },
  ];
  reminders: {
    useDefault: boolean;
    overrides: [
      {
        method: "email" | "popup";
        minutes: number;
      },
    ];
  };
  source: {
    url: string;
    title: string;
  };
}
