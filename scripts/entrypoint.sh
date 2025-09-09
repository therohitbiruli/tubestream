#!/bin/sh
set -e

echo "🚀 Running Prisma migrations..."
npx prisma migrate deploy --schema=./prisma/schema.prisma

echo "🌱 Seeding database..."
npx ts-node ./prisma/seed.ts

echo "✅ Starting Next.js..."
npm run start
