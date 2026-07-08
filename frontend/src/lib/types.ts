import type { inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "../../../.generated/trpc/server";

type RouterOutputs = inferRouterOutputs<AppRouter>;

export type Patient = RouterOutputs["patients"]["getAll"][number];
export type Observation = Patient["observations"][number];
