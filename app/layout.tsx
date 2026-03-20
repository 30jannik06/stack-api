import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "stack-api",
  description: "A modular API built with Next.js",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
