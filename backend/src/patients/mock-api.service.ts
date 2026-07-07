import { Injectable, Logger } from '@nestjs/common';
import { ObservationMetadata } from './observation-metadata';

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
  private readonly logger = new Logger(MockApiService.name);
  private readonly url = process.env.MOCK_API_URL ?? 'https://mockapi-furw4tenlq-ez.a.run.app/data';

  /** Fetches the raw dataset for exactly one randomly generated patient. */
  async fetchOnePatient(): Promise<MockObservationRow[]> {
    const res = await fetch(this.url);
    if (!res.ok) {
      throw new Error(`Mock API request failed: ${res.status} ${res.statusText}`);
    }
    const data = (await res.json()) as MockObservationRow[];
    return Array.isArray(data) ? data : [];
  }

  /**
   * Fetches `count` USABLE patients (i.e. datasets with at least one
   * timepoint, since a dataset with zero timepoints carries no client_id and
   * therefore cannot be persisted as a patient). The mock API occasionally
   * returns an empty dataset, so we retry with a generous cap to avoid an
   * infinite loop while still trying hard to reach the requested count.
   */
  async fetchPatients(count: number): Promise<MockObservationRow[][]> {
    const results: MockObservationRow[][] = [];
    const maxAttempts = Math.max(count * 5, 20);
    let attempts = 0;

    while (results.length < count && attempts < maxAttempts) {
      attempts++;
      try {
        const rows = await this.fetchOnePatient();
        if (rows.length > 0) {
          results.push(rows);
        } else {
          this.logger.debug('Mock API returned an empty (0 timepoint) dataset, retrying');
        }
      } catch (err) {
        this.logger.warn(`Mock API call failed, retrying: ${(err as Error).message}`);
      }
    }

    if (results.length < count) {
      this.logger.warn(
        `Only obtained ${results.length}/${count} usable patients after ${attempts} attempts`,
      );
    }

    return results;
  }
}
