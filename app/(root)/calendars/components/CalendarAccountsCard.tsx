"use client";

import { Plus, Trash } from "lucide-react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { removeCalendarAccount } from "@/lib/actions/user.actions";
import { GOOGLE_OAUTH_FULL_URL } from "@/constants";

interface CalendarAccountsCardProps {
  accountData: {
    email: string;
    failedAuth: boolean;
  }[];
}

export const CalendarAccountsCard = ({
  accountData,
}: CalendarAccountsCardProps) => {
  return (
    <TooltipProvider>
      <Card>
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
        {accountData.length > 0 && <Separator />}
        <CardContent className="flex flex-col gap-4 p-4">
          {accountData.map(({ email, failedAuth }) => (
            <div
              key={email}
              className="flex items-center justify-between gap-4"
            >
              {failedAuth ? (
                <>
                  <p className="text-small-regular text-red-500">
                    {`${email} (auth failed)`}
                  </p>
                  <Link
                    href={GOOGLE_OAUTH_FULL_URL}
                    className={`flex align-middle rounded-3xl ${buttonVariants({
                      variant: "secondary",
                    })}`}
                  >
                    <p className="text-small-regular">Reauth</p>
                  </Link>
                </>
              ) : (
                <p className="text-small-regular">{email}</p>
              )}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeCalendarAccount(email);
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
