FROM node:22-slim

WORKDIR /app

RUN apt-get update -y \
    && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*

# Build from the repository root context:
# docker build -f backend/Dockerfile .
COPY package.json package-lock.json ./
COPY client/package.json ./client/package.json
COPY backend/package.json ./backend/package.json
RUN npm ci

COPY backend ./backend

# Client generation validates the URL format but does not connect to the database.
RUN DATABASE_URL="mysql://unused:unused@localhost:3306/unused" \
    npm exec --workspace backend -- prisma generate
RUN npm run build --workspace backend

EXPOSE 3000

CMD ["node", "backend/dist/main.js"]
