#!/bin/bash
set -e

echo "Running custom build script..."
echo "Current directory: $(pwd)"
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# Ensure we're in the right directory
cd /home/site/wwwroot

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install --production=false
fi

# Build the Next.js application
echo "Building Next.js application..."
NODE_ENV=production npm run build

echo "Build completed successfully!"
echo "Checking for .next directory..."
if [ -d ".next" ]; then
    echo ".next directory found!"
    ls -la .next/
else
    echo "ERROR: .next directory not found!"
    exit 1
fi
