import "reflect-metadata";
import { Injectable, Logger } from "@nestjs/common";
import { Mutation, Query, Router } from "nestjs-trpc";
import { z } from "zod";
import { DEFAULT_PATIENT_COUNT, PatientsService } from "./patients.service";
import { Patient } from "../../../.generated/prisma/client"; // hypothetical package decorators

const countSchema = z
  .object({ count: z.number().int().positive().max(200).optional() })
  .optional();

interface PatientWithObservations extends Patient {
  observations: {
    id: string;
    dateTesting: Date;
    metadata: Record<string, unknown>;
  }[];
}

export const PatientsListSchema = z.array(z.custom<PatientWithObservations>());

@Injectable()
@Router({ alias: "patients" })
export class PatientsRouter {
  private readonly logger = new Logger(PatientsRouter.name);

  constructor(private readonly patientsService: PatientsService) {}

  /** Returns all patients with their observations with the most recent first */
  @Query({
    output: PatientsListSchema,
  })
  async getAll() {
    return this.patientsService.getAll();
  }

  /**
   * Called when the app is opened in the browser. If the DB is already
   * populated we just return the existing data, otherwise we seed it from the mock API.
   */
  @Query({
    output: PatientsListSchema,
  })
  async init(count: number = DEFAULT_PATIENT_COUNT) {
    return this.patientsService.ensureSeeded(count);
  }

  /** Empties the DB and re-seeds it with a fresh batch of patients. */
  @Mutation({
    input: countSchema,
    output: PatientsListSchema,
  })
  async reset(count: number = DEFAULT_PATIENT_COUNT) {
    console.log(await this.patientsService.reset(count));
    return this.patientsService.reset(count);
  }

  /** Fetches a fresh batch of patients from the mock API and adds them to the DB. */
  @Mutation({
    input: countSchema,
    output: PatientsListSchema,
  })
  async addNew(count: number = DEFAULT_PATIENT_COUNT) {
    return this.patientsService.addNew(count);
  }
}
