import { formatTimeInTimeZone } from "@/lib/time";
import { getTimeZones } from "@vvo/tzdb";
import { useState, useEffect } from "react";

export const TimezoneText = ({ timezone }: { timezone: string }) => {
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formattedTimezone =
    getTimeZones().find((tz) => tz.name === timezone)?.alternativeName ??
    timezone;

  const formattedCurrentTime = formatTimeInTimeZone(currentTime, timezone);
  return (
    <span className="text-small-regular ml-2">
      ({formattedTimezone}, now is {formattedCurrentTime}){" "}
    </span>
  );
};
