# Build the frontend from the repository root context:
# docker build -f client/Dockerfile .
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
COPY client/package.json ./client/package.json
COPY backend/package.json ./backend/package.json
RUN npm ci

COPY client ./client

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build --workspace client

FROM nginx:alpine
COPY --from=builder /app/client/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
