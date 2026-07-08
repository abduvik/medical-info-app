import { Injectable, Logger } from "@nestjs/common";
import { Mutation, Query, Router } from "nestjs-trpc";
import { z } from "zod";
import { DEFAULT_PATIENT_COUNT, PatientsService } from "./patients.service"; // hypothetical package decorators

const countSchema = z
  .object({ count: z.number().int().positive().max(200).optional() })
  .optional();

@Injectable()
@Router({ alias: "patients" })
export class PatientsRouter {
  private readonly logger = new Logger(PatientsRouter.name);

  constructor(private readonly patientsService: PatientsService) {}

  /** Returns all patients with their observations with the most recent first */
  @Query()
  async getAll() {
    return this.patientsService.getAll();
  }

  /**
   * Called when the app is opened in the browser. If the DB is already
   * populated we just return the existing data, otherwise we seed it from the mock API.
   */
  @Query()
  async init(count: number = DEFAULT_PATIENT_COUNT) {
    return this.patientsService.ensureSeeded(count);
  }

  /** Empties the DB and re-seeds it with a fresh batch of patients. */
  @Mutation({
    input: countSchema,
  })
  async reset(count: number = DEFAULT_PATIENT_COUNT) {
    return this.patientsService.reset(count);
  }

  /** Fetches a fresh batch of patients from the mock API and adds them to the DB. */
  @Mutation({
    input: countSchema,
  })
  async addNew(count: number = DEFAULT_PATIENT_COUNT) {
    return this.patientsService.addNew(count);
  }
}
