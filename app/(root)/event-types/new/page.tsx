import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

import EventTypeForm from "@/components/EventTypeForm";
import Link from "next/link";

const Page = () => {
  return (
    <section className="flex flex-col items-center">
      <div className="main-container_top-bar">
        <Button variant="outline" className="rounded-3xl">
          <Link href="/event-types">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
        <h1 className="flex-1 text-center text-heading3 text-neutral-600 pr-20">
          Create New Event Type
        </h1>
      </div>

      <EventTypeForm action="create" />
    </section>
  );
};

export default Page;
