# Patient Time Series — Case Study

A full-stack app that pulls mocked patient time-series data from
`https://mockapi-furw4tenlq-ez.a.run.app/data`, persists it in PostgreSQL via
Prisma, and displays it in a table with **Reset** and **Add new data**
controls.

## Stack

| Layer     | Choice |
|-----------|--------|
| Frontend  | Next.js (App Router) + Tailwind CSS + SCSS |
| API layer | tRPC (mounted inside NestJS on `/trpc`) |
| Backend   | NestJS |
| ORM       | Prisma |
| Database  | PostgreSQL (Dockerized) |
| Process manager (prod) | PM2 |

## Repo layout — single package.json

There is **one** `package.json` at the repo root containing every dependency
for both the backend and the frontend, and no per-app `node_modules`.

```
patient-timeseries/
  package.json            # single package.json for backend + frontend
  tsconfig.json            # base TS config used by NestJS
  tsconfig.build.json       # build-only variant (excludes frontend/tests)
  nest-cli.json             # points Nest at backend/src
  ecosystem.config.js       # PM2 config for the backend in prod
  .env.example              # single source of config/secrets
  docker-compose.yml        # DEV: PostgreSQL only
  docker-compose.prod.yml   # PROD: extends dev + backend (pm2) + frontend (nginx)
  docker/
    backend.Dockerfile
    frontend.Dockerfile
    nginx.frontend.conf
  prisma/
    schema.prisma
    migrations/
  backend/
    src/                    # NestJS app (Nest DI, tRPC router mounted on /trpc)
  frontend/
    next.config.js, tailwind.config.js, postcss.config.js, tsconfig.json
    src/
      app/                  # Next.js App Router (layout, page, globals.scss)
      components/           # Providers, PatientTable
      lib/trpc.ts           # tRPC React client
```

Both apps are run via root-level npm scripts that target each folder
explicitly (`nest build` uses `nest-cli.json`'s `sourceRoot`, `next dev
frontend` / `next build frontend` point the Next CLI at the `frontend/`
directory). This keeps a single `npm install`, a single lockfile, and a
single `node_modules`, while the two apps stay cleanly separated on disk.

## How it fits together

```
Browser ── tRPC (httpBatchLink) ──▶ NestJS app ──▶ PatientsService ──▶ Prisma ──▶ PostgreSQL
                                         │
                                         └──▶ MockApiService ──▶ external mock API
```

NestJS hosts the app (modules, DI, lifecycle hooks); a `TrpcService` mounts
the tRPC Express middleware directly onto Nest's underlying HTTP adapter at
`/trpc`. Business logic lives in regular, testable Nest providers
(`PatientsService`, `MockApiService`); the tRPC router (`backend/src/trpc/*`)
is a thin layer that wires procedures to those services. The `AppRouter`
type is exported for the frontend to import with `import type`, so the
frontend gets full end-to-end type safety without ever bundling backend
runtime code (verified: the frontend build only needs the backend **source
files** present for type-checking, not `node_modules`/execution).

## Database schema (Prisma) — unstructured measurements

```prisma
model Patient {
  id           String        @id @default(uuid())
  clientId     String        @unique   // client_id from the mock API
  birthdate    DateTime?
  gender       Int?
  ethnicity    Int?
  createdAt    DateTime      @default(now())
  observations Observation[]
}

model Observation {
  id          String   @id @default(uuid())
  patient     Patient  @relation(fields: [patientId], references: [id], onDelete: Cascade)
  patientId   String
  dateTesting DateTime
  metadata    Json     // unstructured: { creatine, creatine_unit, chloride, ... }
  createdAt   DateTime @default(now())

  @@unique([patientId, dateTesting])
  @@index([patientId, dateTesting])
}
```

A `Patient` = one call to the mock API (`client_id`). Each row it returns
becomes one `Observation` (a timepoint). **All of the mock API's measurement
fields (creatine, chloride, fasting_glucose, potassium, sodium,
total_calcium, total_protein, and their `*_unit` companions) are stored
as-is in the `metadata` JSON column** rather than as fixed table columns —
if the mock API adds, removes, or renames a measurement field, no schema
migration is needed.

On the TypeScript side, `metadata` is still strongly typed rather than a bare
`Record<string, unknown>`. `backend/src/patients/observation-metadata.ts`
defines an `ObservationMetadata` interface that enumerates every measurement
field the mock API is currently known to send (each optional, since any
observation may be missing some), plus a string index signature so
new/renamed fields don't break the build. This type is shared (via
`import type`) by:
- `MockObservationRow` (mock-api.service.ts) — the raw API row extends it,
- `extractMetadata()` (patients.service.ts) — builds it when persisting,
- `PatientTable.tsx` — reads it when deriving/rendering measurement columns,

so both ends of the app work with the same named shape instead of `any`/`Record`.
The frontend's `PatientTable` still derives its displayed columns dynamically
from whatever keys are actually present in the loaded `metadata` objects.

The full initial migration SQL is in
`prisma/migrations/20250101000000_init/migration.sql`.

## Behavior

- **On open**: the frontend calls `patients.init`. The backend checks if the
  DB is empty; if so it fetches `DEFAULT_PATIENT_COUNT` (10) patients from
  the mock API and persists them, then returns the full patient list either
  way — idempotent/safe to call on every page load.
- **Reset**: `patients.reset` deletes all patients (observations cascade),
  then fetches and persists a fresh batch of `DEFAULT_PATIENT_COUNT`
  patients.
- **Add new data**: `patients.addNew` fetches another `DEFAULT_PATIENT_COUNT`
  patients from the mock API and appends them to the existing data.
- The backend is stateless: all state lives in Postgres.

## Edge cases & optimizations handled

- **Empty datasets**: the mock API can return `[]`, which carries no
  `client_id`. `MockApiService.fetchPatients()` retries (capped attempt
  budget) until it collects the requested number of usable patients,
  logging a warning if the cap is hit.
- **Idempotent upserts**: patients are upserted by `clientId`; observations
  are bulk-inserted with `skipDuplicates: true` on the
  `(patientId, dateTesting)` unique constraint.
- **Batch inserts**: one `createMany` call per patient rather than one
  insert per row.
- **Transactional persistence**: each `addNew`/`reset` batch runs inside a
  single Prisma `$transaction`.
- **Indexes**: `Patient.createdAt` and `Observation(patientId, dateTesting)`
  are indexed for the hot query paths.
- **Date-safe serialization**: `superjson` is the tRPC transformer so `Date`
  fields survive the wire round-trip as real `Date`s.

## Configuration — one `.env` file, no hardcoded secrets

All config/secrets live in a single root `.env` (copy from `.env.example`).
Both `docker-compose.yml` and `docker-compose.prod.yml` read it via
`env_file:`/`${VAR}` interpolation — nothing is hardcoded in the compose
files.

| Variable | Default | Purpose |
|---|---|---|
| `POSTGRES_USER` / `POSTGRES_PASSWORD` / `POSTGRES_DB` | `patient_app` / `patient_app` / `patient_timeseries` | Postgres credentials |
| `POSTGRES_PORT` | `5432` | host port for Postgres |
| `DATABASE_URL` | `...@localhost:5432/...` | used by the backend when run on the host (dev). Overridden to point at the `db` service hostname in `docker-compose.prod.yml` |
| `MOCK_API_URL` | assignment's mock API | data source |
| `DEFAULT_PATIENT_COUNT` | `10` | patients fetched on init/reset/add-new |
| `BACKEND_PORT` | `4000` | backend HTTP port |
| `CORS_ORIGIN` | `http://localhost:3000` | allowed frontend origin |
| `NEXT_PUBLIC_TRPC_URL` | `http://localhost:4000/trpc` | backend tRPC endpoint, baked into the frontend build |
| `FRONTEND_PORT` | `3000` | host port for the prod frontend container |

## Running it

### Dev mode (recommended for local development)

Only the database runs in Docker; the backend and frontend run on the host
so you get hot reload for both.

```bash
cp .env.example .env

# 1. Start Postgres
docker compose up -d

# 2. Install everything (single package.json) + generate Prisma client + apply migrations
npm install
npx prisma migrate deploy

# 3. Run backend + frontend together
npm run dev
```

- Frontend: http://localhost:3000
- Backend / tRPC: http://localhost:4000/trpc

`npm run dev` uses `concurrently` to run `nest start --watch` and
`next dev frontend` side by side in one terminal.

### Build (backend + frontend separately)

```bash
npm run build            # runs build:backend then build:frontend
npm run build:backend    # nest build -> dist/backend
npm run build:frontend   # next build frontend -> frontend/out (static export)
```

### Production stack (Docker)

`docker-compose.prod.yml` **extends** the dev compose file (which defines
`db`) and adds:
- `backend`: built from source, migrations applied automatically, then run
  under **PM2** (`pm2-runtime ecosystem.config.js`).
- `frontend`: Next.js built as a **static export** and served by its own
  **nginx** container (no Node runtime needed in prod for the frontend).

```bash
cp .env.example .env
docker compose -f docker-compose.yml -f docker-compose.prod.yml --env-file .env up --build -d
```

- Frontend (nginx): http://localhost:3000
- Backend (pm2): http://localhost:4000/trpc
- Postgres: localhost:5432

## Styling

- **Tailwind CSS** is used for layout/utility classes directly in JSX
  (`frontend/tailwind.config.js`, `frontend/postcss.config.js`).
- **SCSS** (`frontend/src/app/globals.scss`) starts with the Tailwind
  directives and layers hand-written nested SCSS (variables, nesting) for
  the data table, which benefits from more traditional CSS structuring than
  utility classes alone.
