#!/bin/sh

# Wait for the DB to be ready
until pg_isready -h $PGHOST -p $PGPORT -U $PGUSER
do
  echo "Waiting for Postgres..."
  sleep 2
done

# Push schema to DB
npx prisma db push

# Start the app
npm run dev
