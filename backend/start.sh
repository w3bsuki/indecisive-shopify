#!/bin/bash

# Run migrations
echo "Running database migrations..."
yarn db:migrate

# Start the server
echo "Starting Medusa server..."
exec yarn start