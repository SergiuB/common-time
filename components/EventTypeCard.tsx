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

const EventTypeCard = () => {
  return (
    <Card className="w-[350px] cursor-pointer transition ease-in-out duration-150 hover:-translate-y-1.5 hover:shadow-lg">
      <CardHeader>
        <CardTitle>90 minute massage / 200 lei / Sergiu</CardTitle>
        <CardDescription>1 hr 30 mins, One-on-One</CardDescription>
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
                <Button variant="outline" size="icon">
                  <Copy className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Duplicate</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <Share className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Share</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="destructive" size="icon">
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
