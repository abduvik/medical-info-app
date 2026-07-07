import { initTRPC } from '@trpc/server';
import superjson from 'superjson';
import { PatientsService } from '../patients/patients.service';

export interface TrpcContext {
  patientsService: PatientsService;
}

// superjson lets Date objects (e.g. dateTesting, birthdate) survive the
// round trip as real Dates instead of plain strings.
const t = initTRPC.context<TrpcContext>().create({ transformer: superjson });

export const router = t.router;
export const publicProcedure = t.procedure;
