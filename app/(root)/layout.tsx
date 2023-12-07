import {
  ClerkProvider,
  RedirectToSignIn,
  SignedIn,
  SignedOut,
  currentUser,
} from "@clerk/nextjs";
import "../globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Topbar from "@/components/Topbar";
import Bottombar from "@/components/Bottombar";
import LeftSidebar from "@/components/LeftSidebar";
import { redirect } from "next/navigation";
import { createUserIfNotExists } from "@/lib/actions/user.actions";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Good Time",
  description: "Simple booking app",
  // icons: [{ rel: "icon", url: "favicon.ico" }],
};

const Layout = async ({ children }: React.PropsWithChildren) => {
  // Create the user in the database if they don't exist
  try {
    await createUserIfNotExists();
  } catch (error) {
    return redirect("/sign-in");
  }

  return (
    <html lang="en">
      <body className={`${inter.className} text-gray-800`}>
        <Topbar />
        <main className="flex flex-row">
          <LeftSidebar />
          <section className="main-container ">
            <div className="w-full max-x-4xl">{children}</div>
          </section>
        </main>
        <Bottombar />
      </body>
    </html>
  );
};

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <ClerkProvider>
      <SignedIn>
        <Layout>{children}</Layout>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </ClerkProvider>
  );
}
