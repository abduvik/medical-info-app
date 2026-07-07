import { z } from 'zod';
import { publicProcedure, router } from './trpc';

export const patientsRouter = router({
  /**
   * Called once when the app is opened in the browser. Seeds the DB from the
   * mock API only if it is currently empty, otherwise returns existing data.
   */
  init: publicProcedure.query(({ ctx }) => ctx.patientsService.ensureSeeded()),

  /** Plain read, used to refresh the table without touching the mock API. */
  getAll: publicProcedure.query(({ ctx }) => ctx.patientsService.getAll()),

  /** "reset" button: wipes the DB and re-seeds it with a fresh batch. */
  reset: publicProcedure
    .input(z.object({ count: z.number().int().positive().max(200).optional() }).optional())
    .mutation(({ ctx, input }) => ctx.patientsService.reset(input?.count)),

  /** "add new data" button: fetches another batch and appends it. */
  addNew: publicProcedure
    .input(z.object({ count: z.number().int().positive().max(200).optional() }).optional())
    .mutation(({ ctx, input }) => ctx.patientsService.addNew(input?.count)),
});
