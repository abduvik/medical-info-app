import Providers from "@/components/Providers";
import React from "react";

interface PageLayoutProps {
  children: React.ReactNode;
}

export const PageLayout = ({ children }: PageLayoutProps) => (
  <html lang="en">
    <body>
      <main className="mx-auto max-w-6xl px-6 py-10">
        <Providers>{children}</Providers>
      </main>
    </body>
  </html>
);
