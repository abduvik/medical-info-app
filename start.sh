docker compose build
npm run prisma:migrate:deploy
docker compose up --profile production
