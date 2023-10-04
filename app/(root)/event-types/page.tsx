import EventTypeCard from "@/components/EventTypeCard";
import { Button } from "@/components/ui/button";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Plus } from "lucide-react";
import { Share } from "next/font/google";

const Page = async () => {
  return (
    <section className="relative">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button className="fixed right-8 bottom-8 z-20 rounded-full h-24 w-24 ">
              <Plus className="h-10 w-10" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Create Event Type</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <EventTypeCard />
    </section>
  );
};

export default Page;
