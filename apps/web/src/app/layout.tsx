import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Remo Code — Context Bridge for AI Agents",
  description:
    "Open-source persistent memory layer for Codex and Claude. Give your AI coding agents long-term context powered by REMO.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
