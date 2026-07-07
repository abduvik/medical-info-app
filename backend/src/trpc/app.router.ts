import { router } from './trpc';
import { patientsRouter } from './patients.router';

export const appRouter = router({
  patients: patientsRouter,
});

// Exported purely as a TYPE for the frontend's tRPC client.
// The frontend imports this with `import type`, so it is erased at build
// time and the frontend never actually depends on backend runtime code.
export type AppRouter = typeof appRouter;
