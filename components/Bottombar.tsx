"use client";

import { generateSidebarLinks } from "@/constants";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

function Bottombar() {
  const pathname = usePathname();
  const { userId } = useAuth();
  const sidebarLinks = generateSidebarLinks({ userId });

  return (
    <section className="bottombar">
      <div className="bottombar_container">
        {sidebarLinks.map((link) => {
          const isActive =
            (pathname.includes(link.route) && link.route.length > 1) ||
            pathname === link.route;
          return (
            <Link
              href={link.route}
              key={link.label}
              className={`bottombar_link ${
                isActive && "bg-neutral-200 hover:bg-neutral-200"
              }`}
            >
              <Image
                src={link.imgURL}
                alt={link.label}
                width={24}
                height={24}
              />
              <p className="text-subtle-medium  max-sm:hidden">{link.label}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default Bottombar;
