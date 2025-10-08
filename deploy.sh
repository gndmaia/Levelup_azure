#!/bin/bash

# Azure deployment script with build process

set -e

echo "Azure deployment starting..."

# Ensure we're in the right directory
DEPLOY_DIR="${DEPLOYMENT_TARGET:-$DEPLOYMENT_SOURCE}"
if [ -z "$DEPLOY_DIR" ]; then
    DEPLOY_DIR="."
fi

cd "$DEPLOY_DIR"
echo "Working directory: $(pwd)"

# Verify the application files exist
if [ ! -f "server.js" ]; then
    echo "ERROR: server.js not found!"
    exit 1
fi

if [ ! -f "package.json" ]; then
    echo "ERROR: package.json not found!"
    exit 1
fi

# Install dependencies
echo "Installing dependencies..."
if [ -f "package-lock.json" ]; then
    npm ci --production=false
else
    npm install
fi

# Build the Next.js application
echo "Building Next.js application..."
export NODE_ENV=production
npm run build

# Verify the build was successful
if [ ! -d ".next" ]; then
    echo "ERROR: Build failed - .next directory not created!"
    exit 1
fi

echo "Build complete!"
echo "Deployment verification complete. All files present."
echo "Application ready to start with: node server.js"
