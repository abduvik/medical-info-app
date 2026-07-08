FROM node:24-alpine AS build
WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma
COPY .generated ./.generated
RUN npm install

ARG NEXT_PUBLIC_TRPC_URL=http://localhost:4000/trpc
ENV NEXT_PUBLIC_TRPC_URL=$NEXT_PUBLIC_TRPC_URL

COPY tsconfig.json ./tsconfig.json
COPY backend/src ./backend/src
COPY frontend ./frontend
RUN npm run build:frontend


FROM nginx:1.27-alpine
COPY --from=build /app/frontend/out /usr/share/nginx/html
COPY docker/nginx.frontend.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
