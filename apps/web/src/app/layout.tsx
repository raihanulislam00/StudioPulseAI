import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StudioPulse AI — Live Production Incident Commander",
  description:
    "Autonomous incident-response agent for live media and entertainment platforms, built with Google Gemini, Google ADK, and Grafana Cloud MCP.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-slate-100 min-h-screen relative antialiased selection:bg-brand-purple/30 selection:text-white">
        <div className="scanline-overlay fixed inset-0 z-50 pointer-events-none opacity-40" />
        {children}
      </body>
    </html>
  );
}
