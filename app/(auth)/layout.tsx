import { ClerkProvider } from "@clerk/nextjs";
import "../globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Common Time",
  description: "Simple booking app",
};

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className}`}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
