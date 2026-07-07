import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import {
  MockApiService,
  MockObservationRow,
} from "../mock-api/mock-api.service";
import { ObservationMetadata } from "../mock-api/observation-metadata";
import { Prisma } from "../../../generated/prisma/client";

const DEFAULT_PATIENT_COUNT = Number(process.env.DEFAULT_PATIENT_COUNT ?? 10);

// Fields that map onto structured Patient/Observation columns. Everything
// else on a mock API row is unstructured measurement data and gets stored
// in Observation.metadata.
const KNOWN_FIELDS = new Set([
  "client_id",
  "date_testing",
  "date_birthdate",
  "gender",
  "ethnicity",
]);

function extractMetadata(row: MockObservationRow): ObservationMetadata {
  const metadata: ObservationMetadata = {};
  for (const [key, value] of Object.entries(row)) {
    if (!KNOWN_FIELDS.has(key)) {
      metadata[key] = value as ObservationMetadata[string];
    }
  }
  return metadata;
}

@Injectable()
export class PatientsService {
  private readonly logger = new Logger(PatientsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly mockApi: MockApiService,
  ) {}

  /** Returns all patients with their observations with the most recent first */
  async getAll() {
    return this.prisma.patient.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        observations: { orderBy: { createdAt: "desc" } },
      },
    });
  }

  /**
   * Called when the app is opened in the browser. If the DB is already
   * populated we just return the existing data, otherwise we seed it from the mock API.
   */
  async ensureSeeded(count: number = DEFAULT_PATIENT_COUNT) {
    const existing = await this.prisma.patient.count();
    if (existing === 0) {
      this.logger.log(
        `Database empty - seeding ${count} patients from mock API`,
      );
      const datasets = await this.mockApi.fetchPatients(count);
      await this.persist(datasets);
    }
    return this.getAll();
  }

  /** Empties the DB and re-seeds it with a fresh batch of patients. */
  async reset(count: number = DEFAULT_PATIENT_COUNT) {
    this.logger.log("Resetting database");
    // Observations cascade-delete with their Patient.
    await this.prisma.patient.deleteMany({});
    const datasets = await this.mockApi.fetchPatients(count);
    await this.persist(datasets);
    return this.getAll();
  }

  /** Fetches a fresh batch of patients from the mock API and adds them to the DB. */
  async addNew(count: number = DEFAULT_PATIENT_COUNT) {
    this.logger.log(`Adding ${count} new patients`);
    const datasets = await this.mockApi.fetchPatients(count);
    await this.persist(datasets);
    return this.getAll();
  }

  /**
   * Persists a batch of mock-API datasets.
   */
  private async persist(datasets: MockObservationRow[][]) {
    const nonEmpty = datasets.filter((rows) => rows.length > 0);
    if (nonEmpty.length === 0) return;

    await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      for (const rows of nonEmpty) {
        const first = rows[0];

        const patient = await tx.patient.upsert({
          where: { clientId: first.client_id },
          update: {},
          create: {
            clientId: first.client_id,
            birthdate: first.date_birthdate
              ? new Date(first.date_birthdate)
              : null,
            gender: first.gender ?? null,
            ethnicity: first.ethnicity ?? null,
          },
        });

        await tx.observation.createMany({
          data: rows.map((r) => ({
            patientId: patient.id,
            dateTesting: new Date(r.date_testing),
            metadata: extractMetadata(r) as Prisma.InputJsonValue,
          })),
          skipDuplicates: true,
        });
      }
    });
  }
}
