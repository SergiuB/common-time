"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import EventTypeForm from "@/components/EventTypeForm";

const Page = () => {
  const router = useRouter();

  // absolute top-0 left-0 right-0 flex items-center bg-white p-4 border-b
  return (
    <section className="flex flex-col items-center">
      <div className="main-container_top-bar">
        <Button
          variant="outline"
          className="rounded-3xl"
          onClick={() => {
            router.push("/event-types");
          }}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
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
