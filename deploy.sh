#!/bin/bash

# Simple deployment script for Azure
# Since we're providing a pre-built package, minimal setup needed

echo "Azure deployment starting..."

# Ensure we're in the right directory
cd "$DEPLOYMENT_TARGET" || cd "$DEPLOYMENT_SOURCE" || cd "."

# Verify the application files exist
if [ ! -f "server.js" ]; then
    echo "ERROR: server.js not found!"
    exit 1
fi

if [ ! -d ".next" ]; then
    echo "ERROR: .next directory not found!"
    exit 1
fi

if [ ! -d "node_modules" ]; then
    echo "ERROR: node_modules not found!"
    exit 1
fi

echo "Deployment verification complete. All files present."
echo "Application ready to start with: node server.js"
