import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Remo Code",
  description: "Context bridge for Codex and Claude powered by REMO",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
