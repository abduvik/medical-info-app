"use client";

import React from "react";
import { TRPCReactProvider } from "@/lib/trpc";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <TRPCReactProvider>{children}</TRPCReactProvider>;
}
