#!/bin/sh
set -e

echo "Starting deployment checks..."

# Run database migrations
echo "Running Prisma migrations..."
npx prisma migrate deploy

# Optionally seed the database if SEED_DB is set
if [ "$SEED_DB" = "true" ]; then
  echo "Seeding the database..."
  npm run seed || echo "Seeding failed or already seeded."
fi

echo "Starting application..."
exec "$@"
