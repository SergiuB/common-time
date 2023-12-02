import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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

export const addLeadingZero = (num: number) => {
  return num < 10 ? `0${num}` : `${num}`;
};

export const generateTimesInDay = (gapMinutes: number) => {
  const times = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += gapMinutes) {
      times.push(`${addLeadingZero(hour)}:${addLeadingZero(minute)}`);
    }
  }
  return times;
};

export function memoize<T extends (...args: any[]) => any>(
  fn: T,
): (...funcArgs: Parameters<T>) => ReturnType<T> {
  const cache = new Map<string, ReturnType<T>>();

  return (...args: Parameters<T>): ReturnType<T> => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key) as ReturnType<T>;
    }

    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

export type RestParameters<T extends (...args: any) => any> = T extends (
  first: any,
  ...args: infer P
) => any
  ? P
  : never;
