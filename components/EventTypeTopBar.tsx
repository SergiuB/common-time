import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

import Link from "next/link";

export const EventTypeTopBar = async ({ title }: { title: string }) => {
  return (
    <div className="absolute top-0 left-0 right-0 flex items-center bg-white p-4 border-b">
      <Button variant="outline" className="rounded-3xl">
        <Link href="/event-types">
          <div className="flex items-center">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </div>
        </Link>
      </Button>
      <h1 className="flex-1 text-center text-heading3 text-neutral-600 pr-20">
        {title}
      </h1>
    </div>
  );
};
