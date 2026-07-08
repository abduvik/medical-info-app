FROM node:24-alpine AS build
WORKDIR /app

COPY ./ ./
RUN npm install
RUN npm run build:backend


FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
COPY prisma ./prisma
COPY prisma.config.ts prisma.config.ts
COPY --from=build /app/dist/backend ./dist
RUN npm install --omit=dev
COPY ecosystem.config.js ./

EXPOSE 4000

# Apply pending migrations then start the server under PM2. `migrate deploy`
# (not `dev`) is safe to run automatically on container boot.
CMD ["sh", "-c", "npm run prisma:migrate:deploy && npx pm2-runtime ecosystem.config.js"]
