import type { Metadata } from "next";
import { DM_Sans, Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { StoreHydration } from "@/components/providers";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
});

export const metadata: Metadata = {
  title: "CareerOS — The Modern OS for University Career Centers",
  description:
    "Manage, personalize, and measure every step of the student career journey. One platform for students, advisors, alumni, and employers.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${plusJakarta.variable} antialiased`}>
        <StoreHydration />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
