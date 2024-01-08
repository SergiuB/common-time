import Link from "next/link";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";

import { Pacifico } from "next/font/google";

const pacifico = Pacifico({ weight: "400", subsets: ["latin"] });

function Topbar() {
  return (
    <nav className="topbar">
      <Link href="/" className="flex items-center gap-4">
        <Image src="/assets/logo.svg" alt="logo" width={28} height={28} />
        <p className={`${pacifico.className} text-heading3-bold`}>
          Common Time
        </p>
      </Link>

      <UserButton afterSignOutUrl="/sign-in" />
    </nav>
  );
}

export default Topbar;
