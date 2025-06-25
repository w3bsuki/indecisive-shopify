#!/bin/bash
# Ensure build files exist before starting
if [ ! -f ".medusa/server/public/admin/index.html" ]; then
  echo "Admin build missing, rebuilding..."
  npm run build
fi

# Start the server
exec npm start