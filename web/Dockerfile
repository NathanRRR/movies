# Build-only image: produces a static bundle, then copies it to a mounted
# volume so the host nginx can serve it directly (no permanent web container).
FROM node:24-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

CMD ["sh", "-c", "rm -rf /output/* && cp -r /app/dist/. /output/ && echo 'web build copied to /output'"]
