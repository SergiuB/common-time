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
          {children}
        </section>
      </body>
    </html>
  );
}
