import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createTRPCProxyClient, httpLink } from "@trpc/client";
import { createTRPCContext } from "@trpc/tanstack-react-query";
import React, { useState } from "react";
import { AppRouter } from "../../../backend/src/@generated/server";

export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>();

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000,
      },
    },
  });
}

function getTrpcUrl() {
  return process.env.NEXT_PUBLIC_TRPC_URL ?? "http://localhost:4000/trpc";
}

export function TRPCReactProvider(
  props: Readonly<{
    children: React.ReactNode;
  }>,
) {
  const queryClient = makeQueryClient();

  const [trpcClient] = useState(() =>
    createTRPCProxyClient<AppRouter>({
      links: [
        httpLink({
          url: getTrpcUrl(),
        }),
      ],
    }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {props.children}
      </TRPCProvider>
    </QueryClientProvider>
  );
}
