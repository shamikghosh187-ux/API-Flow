import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AXES AI — Research beyond answers",
  description: "Explore scientific questions, analyze research, and discover new ideas with AXES AI.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
