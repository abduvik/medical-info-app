import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "../../../backend/src/trpc/router/app.router";

type RouterOutputs = inferRouterOutputs<AppRouter>;

export type Patient = RouterOutputs["patients"]["getAll"][number];
export type Observation = Patient["observations"][number];
