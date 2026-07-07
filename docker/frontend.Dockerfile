FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma
# postinstall runs `prisma generate`, needed because the frontend imports
# tRPC's AppRouter *type* (see note below), which transitively references
# Prisma's generated types.
RUN npm install

ARG NEXT_PUBLIC_TRPC_URL=http://localhost:4000/trpc
ENV NEXT_PUBLIC_TRPC_URL=$NEXT_PUBLIC_TRPC_URL

COPY tsconfig.json ./tsconfig.json
# Only backend/src is needed (never executed) so Next's build-time type
# checker can resolve the `import type { AppRouter }` used by the frontend.
# It is not copied into the final nginx image.
COPY backend/src ./backend/src
COPY frontend ./frontend
RUN npm run build:frontend
# `output: 'export'` in next.config.js produces a static site at frontend/out


FROM nginx:1.27-alpine
COPY --from=build /app/frontend/out /usr/share/nginx/html
COPY docker/nginx.frontend.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
