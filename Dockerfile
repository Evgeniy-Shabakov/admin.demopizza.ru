FROM node:24-alpine AS builder
WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .
RUN npm run generate

FROM nginx:stable-alpine

COPY --link --from=builder /app/.output/public /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]



