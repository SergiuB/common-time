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
        <section className="flex justify-center relative  min-h-screen  bg-neutral-100 md:p-10">
          <div className=" max-w-md p-4 md:rounded-lg md:border md:border-neutral-200  md:shadow-sm bg-white text-neutral-950 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-50">
            {children}
          </div>
        </section>
      </body>
    </html>
  );
}
