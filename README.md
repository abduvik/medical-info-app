# Patient Time Series — Case Study

A full-stack app that pulls mocked patient time-series data from
`https://mockapi-furw4tenlq-ez.a.run.app/data`, persists it in PostgreSQL via
Prisma, and displays it in a table with **Reset** and **Add new data**
controls.

## Stack

| Layer                  | Choice                                     |
|------------------------|--------------------------------------------|
| Frontend               | Next.js (App Router) + Tailwind CSS + SCSS |
| API layer              | tRPC (mounted inside NestJS on `/trpc`)    |
| Backend                | NestJS                                     |
| ORM                    | Prisma                                     |
| Database               | PostgreSQL (Dockerized)                    |
| Process manager (prod) | PM2                                        |

## Repo Main directory structure

- `.generated`: generated files for Prisma and tRPC
- `backend`: NestJS app
- `frontend`: Next.js app
- `prisma`: database schema + migrations
- `docker`: Docker Compose files to build the app

## Start the app

> Note: Make sure NodeJs and Docker are installed on your machine.

To start the app, run the following commands:

```sh
# Copy the `.env.example` file to `.env` and fill in the values.
cp .env.example .env

# Install dependencies
npm install

# Start the app: This will start the backend, frontend and postgres containers.
npm run dev
```

## Important commands:

Commands are found in the `package.json` file.

- `npm run dev`: Start the app: frontend, backend and postgres containers.
- `npm run generate`: Generate files for Prisma and tRPC.
- `npm run prisma:migrate:deploy`: Deploy the database migrations to PostgreSQL.
- `npm run prisma:migrate:dev -- --name <migration_name>`: Create a new migration file.
- `npm run build`: Build the app for production.


## Deploy to production:

To deploy the app to production, you will need to run `start.sh` script. Make sure to set the environment variables in the `.env` file.

```sh
sh start.sh
```