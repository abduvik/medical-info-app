import type { ObservationMetadata } from "../../../backend/src/patients/observation-metadata";
import { formatDate } from "@/lib/utils";
import { Observation, Patient } from "@/lib/types";

/**
 * Observation.metadata is unstructured JSON (whatever measurement fields the
 * mock API happens to return, e.g. { creatine, creatine_unit, chloride, ... }).
 * Rather than hardcoding column names, we derive the set of "base" measurement
 * keys (stripping any `_unit` companion key) from whatever is actually present
 * across all loaded observations, so new/renamed measurement fields just show
 * up automatically.
 */
function getMetadataColumns(patients: Patient[]): string[] {
  const keys = new Set<string>();
  for (const patient of patients) {
    for (const obs of patient.observations) {
      const metadata = (obs.metadata ?? {}) as unknown as ObservationMetadata;
      for (const key of Object.keys(metadata)) {
        if (!key.endsWith("_unit")) keys.add(key);
      }
    }
  }
  return Array.from(keys).sort();
}

function formatColumnLabel(key: string) {
  return key
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatMetadataValue(metadata: ObservationMetadata, key: string) {
  const value = metadata[key];
  if (value === null || value === undefined) return "—";
  const unit = metadata[`${key}_unit`];
  return unit ? `${value} ${unit}` : String(value);
}

export default function PatientTable({ patients }: { patients: Patient[] }) {
  if (patients.length === 0) {
    return (
      <p className="text-gray-600">
        No patients yet. Click &quot;Add new data&quot; to fetch some.
      </p>
    );
  }

  const metadataColumns = getMetadataColumns(patients);

  return (
    <>
      <p className="mb-3 text-sm text-gray-500">
        {patients.length} patient{patients.length !== 1 ? "s" : ""} loaded
      </p>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Client ID</th>
              <th>Birthdate</th>
              <th>Gender</th>
              <th>Ethnicity</th>
              <th>Test date</th>
              {metadataColumns.map((key) => (
                <th key={key}>{formatColumnLabel(key)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) =>
              patient.observations.length === 0 ? (
                <tr key={patient.id}>
                  <td>{patient.clientId}</td>
                  <td>{formatDate(patient.birthdate)}</td>
                  <td>{patient.gender !== null ? patient.gender : "—"}</td>
                  <td>{patient.ethnicity ?? "—"}</td>
                  <td
                    colSpan={1 + metadataColumns.length}
                    className="empty-cell"
                  >
                    No observations for this patient
                  </td>
                </tr>
              ) : (
                patient.observations.map((obs: Observation, idx: number) => {
                  const metadata = (obs.metadata ??
                    {}) as unknown as ObservationMetadata;
                  return (
                    <tr key={obs.id}>
                      {idx === 0 && (
                        <>
                          <td rowSpan={patient.observations.length}>
                            {patient.clientId}
                          </td>
                          <td rowSpan={patient.observations.length}>
                            {formatDate(patient.birthdate)}
                          </td>
                          <td rowSpan={patient.observations.length}>
                            {patient.gender !== null ? patient.gender : "—"}
                          </td>
                          <td rowSpan={patient.observations.length}>
                            {patient.ethnicity ?? "—"}
                          </td>
                        </>
                      )}
                      <td>{formatDate(obs.dateTesting)}</td>
                      {metadataColumns.map((key) => (
                        <td key={key}>{formatMetadataValue(metadata, key)}</td>
                      ))}
                    </tr>
                  );
                })
              ),
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
