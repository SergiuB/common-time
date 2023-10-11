import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { currentUser, useAuth } from "@clerk/nextjs";

import EventTypeForm from "@/components/EventTypeForm";
import Link from "next/link";
import { fetchEventType } from "@/lib/actions/user.actions";

const Page = async ({ params }: { params: { id: string } }) => {
  const user = await currentUser();
  const eventType = await fetchEventType({
    authId: user!.id,
    eventId: params.id,
  });

  return (
    <section className="flex flex-col items-center">
      <div className="main-container_top-bar">
        <Button variant="outline" className="rounded-3xl">
          <Link href="/event-types">
            <div className="flex items-center">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </div>
          </Link>
        </Button>
        <h1 className="flex-1 text-center text-heading3 text-neutral-600 pr-20">
          Edit Event Type
        </h1>
      </div>

      <EventTypeForm
        action="update"
        eventId={eventType._id!.toString()}
        name={eventType.name}
        durationMin={eventType.durationMin}
        location={eventType.location}
        description={eventType.description}
        scheduleId={eventType.scheduleId.toString()}
        link={eventType.link}
        color={eventType.color}
        dateRangeDays={eventType.dateRangeDays}
        beforeEventMin={eventType.beforeEventMin}
        afterEventMin={eventType.afterEventMin}
      />
    </section>
  );
};

export default Page;
