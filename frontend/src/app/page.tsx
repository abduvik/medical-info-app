"use client";

import PatientTable from "@/components/PatientTable";
import { useTRPC } from "@/lib/trpc";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Basic/Header";
import { Button } from "@/components/Basic/Button";

export default function Home() {
  const trpc = useTRPC();

  // Runs once on mount: backend seeds the DB if empty, otherwise returns
  // whatever is already there. This satisfies the "on app open, backend
  // fetches + persists data" requirement.
  const initQuery = useQuery(trpc.patients.init.queryOptions());

  const resetMutation = useMutation(
    trpc.patients.reset.mutationOptions({
      onSettled: () => initQuery.refetch(),
    }),
  );

  const addNewMutation = useMutation(
    trpc.patients.addNew.mutationOptions({
      onSettled: () => initQuery.refetch(),
    }),
  );

  const patients = initQuery.data ?? [];
  const isBusy =
    initQuery.isFetching || resetMutation.isPending || addNewMutation.isPending;

  return (
    <>
      <Header
        title="Patient Time Series"
        subtitle="Data mocked from an external API and persisted in PostgreSQL via Prisma."
        actions={
          <>
            <Button
              variant="secondary"
              onClick={() => resetMutation.mutate({})}
              disabled={isBusy}
            >
              {resetMutation.isPending ? "Resetting…" : "Reset"}
            </Button>
            <Button
              variant="primary"
              onClick={() => addNewMutation.mutate({})}
              disabled={isBusy}
            >
              {addNewMutation.isPending ? "Fetching…" : "Add new data"}
            </Button>
          </>
        }
      />

      {initQuery.isLoading && (
        <p className="text-gray-600">Loading patients…</p>
      )}

      {initQuery.isError && (
        <p className="mb-4 rounded-lg bg-red-100 px-4 py-2 text-sm text-red-800">
          Failed to load patients: {initQuery.error.message}
        </p>
      )}

      {(resetMutation.isError || addNewMutation.isError) && (
        <p className="mb-4 rounded-lg bg-red-100 px-4 py-2 text-sm text-red-800">
          {(resetMutation.error ?? addNewMutation.error)?.message}
        </p>
      )}

      {initQuery.data && <PatientTable patients={patients} />}
    </>
  );
}
