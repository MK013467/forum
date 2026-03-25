FROM node:22-slim

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

RUN npx prisma generate && npm run build

EXPOSE 3000

CMD ["node", "dist"]