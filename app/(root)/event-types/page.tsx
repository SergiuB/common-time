import EventTypeCard from "@/components/EventTypeCard";
import { Button } from "@/components/ui/button";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { Plus } from "lucide-react";
import Link from "next/link";

const CreateButton = ({ className }: { className: string }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <Button asChild className={className}>
          <TooltipTrigger asChild>
            <Link href="event-types/new">
              <Plus className="h-10 w-10" />
            </Link>
          </TooltipTrigger>
        </Button>
        <TooltipContent>
          <p>Create Event Type</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const Page = async () => {
  const user = await currentUser();
  const userInfo = await fetchUser(user!.id);

  return (
    <section>
      {userInfo?.eventTypes.length ? (
        <div className="relative">
          <CreateButton className="fixed right-8 bottom-8 z-20 rounded-full h-24 w-24 " />
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-2">
            {userInfo?.eventTypes.map(
              ({
                name,
                durationMin,
                _id,
                location,
                description,
                schedule,
                link,
                color,
                dateRangeDays,
                beforeEventMin,
                afterEventMin,
              }) => (
                <div
                  className="animate-in fade-in duration-300"
                  key={_id.toString()}
                >
                  <EventTypeCard
                    name={name}
                    durationMin={durationMin}
                    location={location}
                    description={description}
                    scheduleId={schedule._id.toString()}
                    link={link}
                    color={color}
                    dateRangeDays={dateRangeDays}
                    beforeEventMin={beforeEventMin}
                    afterEventMin={afterEventMin}
                  />
                </div>
              ),
            )}
          </div>
        </div>
      ) : (
        <div className="mt-10 container flex flex-col items-center justify-center gap-4">
          <h1 className="text-heading2-semibold text-neutral-700 text-">
            Nothing here ¯\_(ツ)_/¯
          </h1>
          <p className="text-body-normal text-neutral-700 text-">
            Let&apos;s start by creating an event type
          </p>
          <CreateButton className="mt-8 z-20 rounded-full h-24 w-24 " />
        </div>
      )}
    </section>
  );
};

export default Page;
