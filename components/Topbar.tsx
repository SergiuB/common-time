import Link from "next/link";
import Image from "next/image";
import { SignOutButton, SignedIn, UserButton } from "@clerk/nextjs";

function Topbar() {
  return (
    <nav className="topbar">
      <Link href="/" className="flex items-center gap-4">
        <Image src="/assets/logo.svg" alt="logo" width={28} height={28} />
        <p className="text-heading3-bold ">Good Time</p>
      </Link>

      <UserButton afterSignOutUrl="/sign-in" />
    </nav>
  );
}

export default Topbar;
