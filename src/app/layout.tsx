import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import { Toaster } from "sonner";
import type { ReactNode } from "react";

import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zorvyn Finance Dashboard",
  description: "Backend-driven finance dashboard with role-based access controls.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100">
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}

