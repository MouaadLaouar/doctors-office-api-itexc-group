#!/bin/bash

# Function to wait for database
wait_for_db() {
  echo "Waiting for database to be ready..."
  while ! nc -z db 5432; do
    sleep 1
  done

  # Additional wait to ensure Postgres is really ready
  sleep 5
  echo "Database is ready!"
}

# Wait for database
wait_for_db

# Run database migrations
echo "Running database migrations..."
npx prisma migrate dev --name init

# Generate Prisma Client
echo "Generating Prisma Client..."
npx prisma generate

# Start the application
echo "Starting the application..."
npm start