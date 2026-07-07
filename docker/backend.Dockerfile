FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma
RUN npm install

COPY tsconfig.json tsconfig.build.json nest-cli.json ./
COPY backend ./backend
RUN npx prisma generate
RUN npm run build:backend


FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
COPY prisma ./prisma
# pm2 is a regular ("production") dependency so it survives --omit=dev
RUN npm install --omit=dev
RUN npx prisma generate

COPY --from=build /app/dist ./dist
COPY ecosystem.config.js ./

EXPOSE 4000

# Apply pending migrations then start the server under PM2. `migrate deploy`
# (not `dev`) is safe to run automatically on container boot.
CMD ["sh", "-c", "npx prisma migrate deploy && npx pm2-runtime ecosystem.config.js"]
