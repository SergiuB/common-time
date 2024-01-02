import { addLeadingZero } from "./utils";

// subtracts two time intervals
export function subtractTimeIntervals(
  start1: number,
  end1: number,
  start2: number,
  end2: number,
): [number, number][] {
  const result: [number, number][] = [];

  if (start1 >= end1 || start2 >= end2) {
    throw new Error("Invalid time interval");
  }

  if (end1 <= start2) {
    result.push([start1, end1]);
    return result;
  }

  if (start1 >= end2) {
    result.push([start1, end1]);
    return result;
  }

  if (start1 < start2 && end1 > end2) {
    result.push([start1, start2]);
    result.push([end2, end1]);
    return result;
  }

  if (start1 >= start2 && end1 <= end2) {
    return result;
  }

  if (start1 >= start2 && start1 < end2 && end1 > end2) {
    result.push([end2, end1]);
    return result;
  }

  if (start2 > start1 && start2 <= end1 && end1 <= end2) {
    result.push([start1, start2]);
    return result;
  }

  return result;
}

export function subtractBusyIntervals(
  start: number,
  end: number,
  busyIntervals: {
    start: number;
    end: number;
  }[],
) {
  const sortedBusyIntervals = busyIntervals.sort((a, b) => a.start - b.start);

  let freeIntervals: [number, number][] = [[start, end]];
  const intersectingBusyIntervals = sortedBusyIntervals.filter(
    ({ start: busyStart, end: busyEnd }) =>
      intervalsIntersect(start, end, busyStart, busyEnd),
  );

  for (const { start: busyStart, end: busyEnd } of intersectingBusyIntervals) {
    const newFreeIntervals: [number, number][] = [];

    for (const [freeStart, freeEnd] of freeIntervals) {
      newFreeIntervals.push(
        ...subtractTimeIntervals(freeStart, freeEnd, busyStart, busyEnd),
      );
    }

    freeIntervals = newFreeIntervals;
  }

  return freeIntervals;
}

export function intervalsIntersect(
  start1: number,
  end1: number,
  start2: number,
  end2: number,
) {
  return (
    (start2 <= start1 && start1 < end2) || (start1 <= start2 && start2 < end1)
  );
}

export function extractSubintervals(
  start: number,
  end: number,
  subIntervalLength: number,
  step = 1,
) {
  const result: [number, number][] = [];

  if (start >= end) {
    throw new Error("Invalid time interval");
  }

  if (subIntervalLength <= 0) {
    throw new Error("Invalid sub interval length");
  }

  let currentStart = start;

  while (currentStart + subIntervalLength <= end) {
    result.push([currentStart, currentStart + subIntervalLength]);
    currentStart += step;
  }
  return result;
}

export function formatMinutes(min: number) {
  const hours = Math.floor(min / 60);
  const minutes = min % 60;
  return hours === 0
    ? `${minutes} min`
    : minutes === 0
    ? `${hours} hr`
    : `${hours} hr ${minutes} min`;
}

export function minutesToTime(min: number) {
  const hours = Math.floor(min / 60);
  const minutes = min % 60;
  return `${addLeadingZero(hours)}:${addLeadingZero(minutes)}`;
}

export function timeToMinutes(time: string) {
  const [hours, minutes] = time.split(":");
  return parseInt(hours) * 60 + parseInt(minutes);
}

export function minutesFromString(str: string) {
  switch (str) {
    case "0 min":
      return 0;
    case "15 min":
      return 15;
    case "30 min":
      return 30;
    case "45 min":
      return 45;
    case "1 hr":
      return 60;
    case "1 hr 30 min":
      return 90;
    case "2 hr":
      return 120;
  }

  throw new Error(`Invalid string: ${str}`);
}

export function minutesToString(minutes: number) {
  switch (minutes) {
    case 0:
      return "0 min";
    case 15:
      return "15 min";
    case 30:
      return "30 min";
    case 45:
      return "45 min";
    case 60:
      return "1 hr";
    case 90:
      return "1 hr 30 min";
    case 120:
      return "2 hr";
  }

  throw new Error(`Invalid number: ${minutes}`);
}

export const generateTimesInDay = (gapMinutes: number) => {
  const times = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += gapMinutes) {
      times.push(`${addLeadingZero(hour)}:${addLeadingZero(minute)}`);
    }
  }
  return times;
};

export function getStartOfWeek(day: Date) {
  const dayOfWeek = day.getDay(); // Day of the week (0 for Sunday, 1 for Monday, etc.)
  const startOfWeek = new Date(day);

  // If your week starts on Sunday, use `startOfWeek.setDate(today.getDate() - dayOfWeek);`
  startOfWeek.setDate(day.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)); // Set to Monday of the current week

  return startOfWeek;
}

export function getFutureDays(day: Date, count: number) {
  const futureDays = [];

  for (let i = 0; i < count; i++) {
    const date = new Date(day);
    date.setDate(day.getDate() + i);
    futureDays.push(date);
  }

  return futureDays.map((date) => ({
    start: date.setHours(0, 0, 0, 0),
    end: date.setHours(23, 59, 59, 999),
  }));
}