import { createTRPCReact } from '@trpc/react-query';
import { httpBatchLink } from '@trpc/client';
import superjson from 'superjson';
// Type-only import: erased at build time, so the frontend never actually
// depends on backend runtime code (see backend/src/trpc/app.router.ts).
import type { AppRouter } from '../../../backend/src/trpc/app.router';

export const trpc = createTRPCReact<AppRouter>();

const TRPC_URL = process.env.NEXT_PUBLIC_TRPC_URL ?? 'http://localhost:4000/trpc';

export function createTrpcClient() {
  return trpc.createClient({
    transformer: superjson,
    links: [
      httpBatchLink({
        url: TRPC_URL,
      }),
    ],
  });
}
