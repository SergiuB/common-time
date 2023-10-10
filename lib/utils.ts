import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMinutes(min: number) {
  const hours = Math.floor(min / 60);
  const minutes = min % 60;
  return hours === 0 ? `${minutes} min` : `${hours} hr ${minutes} min`;
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
