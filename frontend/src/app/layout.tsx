import type { Metadata } from "next";
import "./globals.scss";
import React from "react";
import { PageLayout } from "@/components/Layout/PageLayout";

export const metadata: Metadata = {
  title: "Patient Time Series",
  description: "Mocked patient time-series data backed by PostgreSQL + Prisma",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PageLayout>{children}</PageLayout>;
}
