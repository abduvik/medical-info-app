import type { Metadata } from "next";
import Providers from "@/components/Providers";
import "./globals.scss";
import React from "react";

export const metadata: Metadata = {
  title: "Patient Time Series",
  description: "Mocked patient time-series data backed by PostgreSQL + Prisma",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
