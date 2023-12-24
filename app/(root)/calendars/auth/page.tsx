"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getTokensUsingAuthCode } from "@/lib/actions/auth.actions";
import { storeCalendarTokens } from "@/lib/actions/user.actions";

interface PageProps {
  searchParams: {
    code: string;
  };
}

const Page = ({ searchParams }: PageProps) => {
  const router = useRouter();

  useEffect(() => {
    if (searchParams?.code) {
      getTokensUsingAuthCode(searchParams.code)
        .then(storeCalendarTokens)
        .then(() => router.push("/calendars"));
    }
  }, [router, searchParams?.code]);

  return null;
};

export default Page;
