"use client";

import * as React from "react";
import { Share, Copy, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "./ui/tooltip";
import { formatMinutes } from "@/lib/utils";
import { colorVariants, eventColors } from "@/constants";
import {
  deleteEventType,
  duplicateEventType,
} from "@/lib/actions/user.actions";
import { useRouter } from "next/navigation";

interface Props {
  authId: string;
  id: string;
  name: string;
  durationMin: number;
  location: string;
  description: string;
  scheduleId: string;
  link: string;
  color: number;
  dateRangeDays: number;
  beforeEventMin: number;
  afterEventMin: number;
}

const EventTypeCard = ({
  authId,
  id,
  name,
  durationMin,
  link,
  color,
}: Props) => {
  const router = useRouter();
  const editEventType = () => {
    router.push(`/event-types/${id}`);
  };
  return (
    <Card
      className=" cursor-pointer transition ease-in-out duration-150 hover:-translate-y-1.5 hover:shadow-lg"
      onClick={editEventType}
    >
      <div
        style={{ backgroundColor: colorVariants[eventColors[color]] }}
        className="w-full h-1 rounded-t-lg"
      ></div>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{formatMinutes(durationMin)}</CardDescription>
      </CardHeader>
      <CardContent>
        <Link
          href="/"
          className="hover:underline underline-offset-2 text-base-regular-light text-primary-500"
        >
          View booking page
        </Link>
      </CardContent>
      <CardFooter className="flex justify-between border-t p-2">
        <Button variant="link" className="flex gap-1 ">
          <Copy className="h-4 w-4" />
          Copy link
        </Button>
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    duplicateEventType({ authId, eventId: id });
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Duplicate</p>
              </TooltipContent>
            </Tooltip>
            {/* <Tooltip> // TODO: Add share functionality
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <Share className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Share</p>
              </TooltipContent>
            </Tooltip> */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteEventType({ authId, eventId: id });
                  }}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardFooter>
    </Card>
  );
};

export default EventTypeCard;
