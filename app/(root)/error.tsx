"use client"; // Error components must be Client Components

import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  if (error.message.includes("token") && error.message.includes("expired")) {
    return <TokenExpiredError />;
  }

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </button>
    </div>
  );
}

const TokenExpiredError = () => {
  return (
    <div>
      <h2 className="text-heading2-bold ">Token Expired</h2>
      <p className="pt-4 inline">
        Your Google Calendar API token has expired. Please go to{" "}
      </p>
      <Link href="/calendars" className="regular-link">
        Calendars page
      </Link>
      <p className="pt-4 inline"> and reauth or readd the calendars.</p>
    </div>
  );
};
