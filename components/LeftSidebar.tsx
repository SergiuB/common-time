"use client";

import { generateSidebarLinks } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

import { Pacifico } from "next/font/google";

const pacifico = Pacifico({ weight: "400", subsets: ["latin"] });

function LeftSidebar() {
  const pathname = usePathname();

  const sidebarLinks = generateSidebarLinks();

  return (
    <section className="custom-scrollbar leftsidebar ">
      <div className="flex w-full flex-1 flex-col gap-6 px-6 ">
        <Link
          href="/"
          className="flex  justify-start gap-4 rounded-lg border-b p-4 pb-6 md:px-0 max-lg:flex-col max-lg:items-center"
        >
          <Image
            className="flex"
            src="/assets/logo.svg"
            alt="logo"
            width={28}
            height={28}
          />
          <div
            className={`flex max-lg:flex-col ${pacifico.className} text-heading3-bold  text-neutral-600`}
          >
            <p>Common</p>
            <p>Time</p>
          </div>
        </Link>
        <div className="flex w-full flex-1 flex-col gap-6 ">
          {sidebarLinks.map((link) => {
            const isActive =
              (pathname.includes(link.route) && link.route.length > 1) ||
              pathname === link.route;

            return (
              <Link
                href={link.route}
                key={link.label}
                className={`leftsidebar_link ${
                  isActive && "bg-neutral-200 hover:bg-neutral-200"
                }`}
              >
                <Image
                  src={link.imgURL}
                  alt={link.label}
                  width={24}
                  height={24}
                />
                <p className="max-lg:hidden">{link.label}</p>
              </Link>
            );
          })}
        </div>
      </div>
      <div className="flex justify-center mb-10">
        <UserButton
          afterSignOutUrl="/sign-in"
          appearance={{
            elements: {
              userButtonAvatarBox: "w-12 h-12",
            },
          }}
        />
      </div>
    </section>
  );
}

export default LeftSidebar;
