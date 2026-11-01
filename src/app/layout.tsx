import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "API-FLOW — One API. The right model.",
  description: "A provider-agnostic AI gateway with intelligent routing, resilient failover, and one OpenAI-compatible endpoint.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}