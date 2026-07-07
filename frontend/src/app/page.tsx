'use client';

import { trpc } from '@/lib/trpc';
import PatientTable from '@/components/PatientTable';

export default function Home() {
  const utils = trpc.useContext();

  // Runs once on mount: backend seeds the DB if empty, otherwise returns
  // whatever is already there. This satisfies the "on app open, backend
  // fetches + persists data" requirement.
  const initQuery = trpc.patients.init.useQuery();

  const resetMutation = trpc.patients.reset.useMutation({
    onSuccess: (data) => utils.patients.init.setData(undefined, data),
  });

  const addNewMutation = trpc.patients.addNew.useMutation({
    onSuccess: (data) => utils.patients.init.setData(undefined, data),
  });

  const patients = initQuery.data ?? [];
  const isBusy = initQuery.isFetching || resetMutation.isLoading || addNewMutation.isLoading;

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patient Time Series</h1>
          <p className="mt-1 text-sm text-gray-500">
            Data mocked from an external API and persisted in PostgreSQL via Prisma.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-900 transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
            onClick={() => resetMutation.mutate({})}
            disabled={isBusy}
          >
            {resetMutation.isLoading ? 'Resetting…' : 'Reset'}
          </button>
          <button
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-opacity hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
            onClick={() => addNewMutation.mutate({})}
            disabled={isBusy}
          >
            {addNewMutation.isLoading ? 'Fetching…' : 'Add new data'}
          </button>
        </div>
      </header>

      {initQuery.isLoading && <p className="text-gray-600">Loading patients…</p>}

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

      {initQuery.data && (
        <>
          <p className="mb-3 text-sm text-gray-500">
            {patients.length} patient{patients.length !== 1 ? 's' : ''} loaded
          </p>
          <PatientTable patients={patients} />
        </>
      )}
    </main>
  );
}
