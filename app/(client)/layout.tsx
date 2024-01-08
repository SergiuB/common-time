import "../globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Common Time",
  description: "Simple booking app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} text-gray-800`}>
        <section className="relative  min-h-screen  items-center bg-neutral-100 px-6 pb-10 pt-28 md:pt-10  max-md:pb-32 sm:px-10; ">
          <div className="w-full max-x-4xl">{children}</div>
        </section>
      </body>
    </html>
  );
}
