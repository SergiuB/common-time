import { ClerkProvider } from "@clerk/nextjs";
import "../globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Topbar from "@/components/Topbar";
import Bottombar from "@/components/Bottombar";
import LeftSidebar from "@/components/LeftSidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Good Time",
  description: "Simple booking app",
  // icons: [{ rel: "icon", url: "favicon.ico" }],
};

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <ClerkProvider>
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
    </ClerkProvider>
  );
}
