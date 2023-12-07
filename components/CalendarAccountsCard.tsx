"use client";

import { Plus, Trash } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { removeCalendarTokens } from "@/lib/actions/user.actions";

const GOOGLE_OAUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const REDIRECT_URI = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI; // e.g., 'http://localhost:3000/api/auth/callback'
const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const SCOPES = "email https://www.googleapis.com/auth/calendar";

const GOOGLE_OAUTH_FULL_URL = `${GOOGLE_OAUTH_URL}?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
  REDIRECT_URI!,
)}&scope=${encodeURIComponent(SCOPES)}&access_type=offline&prompt=consent`;

interface CalendarAccountsCardProps {
  accountEmails: string[];
}

export const CalendarAccountsCard = ({
  accountEmails,
}: CalendarAccountsCardProps) => {
  return (
    <TooltipProvider>
      <Card className="max-w-xl">
        <CardHeader className="p-4 grid grid-cols-2 items-center">
          <CardTitle>Google Calendar Accounts</CardTitle>
          <Link
            href={GOOGLE_OAUTH_FULL_URL}
            className={`justify-self-end flex align-middle rounded-3xl ${buttonVariants()}`}
          >
            <Plus className="h-4 w-4" />
            <p className="text-small-regular">Add</p>
          </Link>
        </CardHeader>
        <Separator />
        <CardContent className="flex flex-col gap-4 p-4">
          {accountEmails.map((email) => (
            <div
              key={email}
              className="flex items-center justify-between gap-4"
            >
              <CardDescription key={email}>{email}</CardDescription>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeCalendarTokens(email);
                    }}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Remove account</p>
                </TooltipContent>
              </Tooltip>
            </div>
          ))}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};
