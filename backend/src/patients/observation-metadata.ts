/**
 * `Observation.metadata` is stored as JSON in Postgres (see prisma/schema.prisma)
 * because the set of measurements the mock API returns is not fixed - but that
 * doesn't mean it has to be typed as a bare `Record<string, unknown>` on the
 * TypeScript side. This type documents every measurement field the mock API is
 * currently known to send (each optional, since any single observation may be
 * missing some of them) while still allowing additional/renamed fields to show
 * up without a compile error, via the string index signature.
 *
 * Backend: `extractMetadata()` in `patients.service.ts` builds this shape when
 * persisting a row from the mock API.
 * Frontend: `PatientTable.tsx` reads this shape (instead of `Record<string, unknown>`)
 * when rendering measurement columns.
 */
export interface ObservationMetadata {
  creatine?: number;
  creatine_unit?: string;

  chloride?: number;
  chloride_unit?: string;

  fasting_glucose?: number;
  fasting_glucose_unit?: string;

  potassium?: number;
  potassium_unit?: string;

  sodium?: number;
  sodium_unit?: string;

  total_calcium?: number;
  total_calcium_unit?: string;

  total_protein?: number;
  total_protein_unit?: string;

  // The mock API is free to introduce new measurement fields; they'll still
  // be persisted and rendered (as a generic value) even though they aren't
  // enumerated above.
  [measurement: string]: number | string | undefined;
}

/** Keys in `ObservationMetadata` that hold a numeric measurement (i.e. not a `*_unit` key). */
export type MeasurementKey = Exclude<keyof ObservationMetadata, `${string}_unit`>;
