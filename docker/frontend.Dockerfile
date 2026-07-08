FROM node:24-alpine AS build
WORKDIR /app

COPY ./ ./
RUN npm install
RUN npm run build:frontend


FROM nginx:1.27-alpine
COPY --from=build /app/dist/frontend /usr/share/nginx/html
COPY docker/nginx.frontend.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
