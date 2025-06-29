#!/bin/bash
echo "Starting build process..."
pnpm install
echo "Building Medusa admin..."
pnpm run build
echo "Build complete!"