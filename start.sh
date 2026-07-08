npm install
docker compose --profile production build
npm run prisma:migrate:deploy
docker compose --profile production up
