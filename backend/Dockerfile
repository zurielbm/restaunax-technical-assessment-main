FROM node:22-alpine

WORKDIR /app
COPY shared ./shared

WORKDIR /app/backend
COPY backend/package.json backend/package-lock.json ./
RUN npm ci

COPY backend ./
RUN DATABASE_URL="postgresql://build:build@localhost:5432/build" npx prisma generate

ENV PORT=3000
EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && npx tsx src/index.ts"]
