FROM node:24-alpine AS build
WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma
RUN npm install

COPY tsconfig.json prisma.config.ts tsconfig.build.json nest-cli.json ./
COPY .generated ./.generated
COPY backend ./backend
RUN npm run build:backend


FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
COPY prisma ./prisma
COPY .generated ./.generated
COPY prisma.config.ts prisma.config.ts
RUN npm install --omit=dev

COPY --from=build /app/dist ./dist
COPY ecosystem.config.js ./

EXPOSE 4000

# Apply pending migrations then start the server under PM2. `migrate deploy`
# (not `dev`) is safe to run automatically on container boot.
CMD ["sh", "-c", "npx prisma migrate deploy && npx pm2-runtime ecosystem.config.js"]
