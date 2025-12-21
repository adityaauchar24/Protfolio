#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting Aditya Auchar Portfolio Frontend..."

# Set environment variables for Render
export NODE_ENV=production
export PORT=${PORT:-3000}

echo "🌐 Environment: $NODE_ENV"
echo "🔢 Port: $PORT"

# Check if dist directory exists
if [ ! -d "dist" ]; then
    echo "❌ Error: dist directory not found. Build the project first."
    echo "💡 Run: npm run build"
    exit 1
fi

# Start the preview server
echo "🚀 Starting Vite preview server on port $PORT..."
npm run preview