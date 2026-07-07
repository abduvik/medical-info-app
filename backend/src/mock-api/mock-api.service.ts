import { Injectable } from "@nestjs/common";
import { ObservationMetadata } from "./observation-metadata";

/**
 * Shape of a single row returned by the mock API. Every call to the mock API
 * returns an ARRAY of these for exactly one (randomly generated) patient -
 * the array can legitimately be empty (0 timepoints) or have a single entry.
 *
 * The identifying/demographic fields (client_id, dates, gender, ethnicity)
 * are typed explicitly. The measurement fields (creatine, chloride, etc.)
 * come from `ObservationMetadata`, so they stay strongly typed rather than
 * falling back to a bare `Record<string, unknown>`.
 */
export interface MockObservationRow extends ObservationMetadata {
  client_id: string;
  date_testing: string;
  date_birthdate: string;
  gender: number;
  ethnicity: number;
}

@Injectable()
export class MockApiService {
  private readonly url =
    process.env.MOCK_API_URL ?? "https://mockapi-furw4tenlq-ez.a.run.app/data";

  /** Fetches the raw dataset for exactly one randomly generated patient. */
  async fetchOnePatient(): Promise<MockObservationRow[]> {
    const res = await fetch(this.url);
    if (!res.ok) {
      throw new Error(
        `Mock API request failed: ${res.status} ${res.statusText}`,
      );
    }
    const data = (await res.json()) as MockObservationRow[];
    return Array.isArray(data) ? data : [];
  }

  /**
   * Fetches `count` number of patients from the mock API.
   * @param count
   */
  async fetchPatients(count: number): Promise<MockObservationRow[][]> {
    return Promise.all<MockObservationRow[]>(
      Array.from({ length: count }, () => this.fetchOnePatient()),
    );
  }
}
