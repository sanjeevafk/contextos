import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ContextOS - Agent-Native Enterprise Memory Layer",
  description: "Ask anything across your company's engineering knowledge. Freshworks Hackathon Track 2.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#fcfdfd] text-[#0f172a] antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
