#!/bin/sh
echo "🚀 Starting Medusa backend..."
echo "Running database migrations..."
yarn db:migrate
echo "Starting Medusa server..."
exec yarn start