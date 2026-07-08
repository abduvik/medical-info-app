# Build and then starting the App
docker compose --profile production down
docker compose --profile production build
docker compose --profile production up -d
