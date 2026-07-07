/**
 * `Observation.metadata` is stored as JSON in Postgres
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
