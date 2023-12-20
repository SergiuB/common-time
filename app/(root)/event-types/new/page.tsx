import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

import EventTypeForm from "@/components/EventTypeForm";
import Link from "next/link";
import { EventTypeTopBar } from "@/components/EventTypeTopBar";

const Page = () => {
  return (
    <section className="flex flex-col items-center">
      <EventTypeTopBar title="New Event Type" />

      <EventTypeForm action="create" />
    </section>
  );
};

export default Page;
