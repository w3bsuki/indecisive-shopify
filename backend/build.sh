#!/bin/bash
echo "Starting build process..."
yarn install
echo "Building Medusa admin..."
yarn build
echo "Build complete!"