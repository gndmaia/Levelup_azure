#!/bin/bash

echo "Starting LevelUp Azure application..."

# Set environment variables
export NODE_ENV=production
export PORT=${PORT:-8080}

# Ensure we're in the correct directory
cd /home/site/wwwroot

# Check if server.js exists
if [ ! -f "server.js" ]; then
    echo "ERROR: server.js not found!"
    ls -la
    exit 1
fi

# Check if .next directory exists
if [ ! -d ".next" ]; then
    echo "ERROR: .next directory not found!"
    ls -la
    exit 1
fi

echo "Starting custom Node.js server..."
exec node server.js