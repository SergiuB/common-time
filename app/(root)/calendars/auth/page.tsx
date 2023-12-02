"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { storeTokensUsingAuthCode } from "@/lib/actions/auth.actions";

interface PageProps {
  searchParams: {
    code: string;
  };
}

const Page = ({ searchParams }: PageProps) => {
  const router = useRouter();

  useEffect(() => {
    if (searchParams?.code) {
      storeTokensUsingAuthCode(searchParams.code);
      router.push("/calendars");
    }
  }, [router, searchParams?.code]);

  return null;
};

export default Page;
