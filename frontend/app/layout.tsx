import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

export const metadata: Metadata = {
  title: "EmptyClassroom",
  description: "Find an empty classroom",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-white overflow-y-scroll">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
