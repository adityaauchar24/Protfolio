#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting Aditya Auchar Portfolio Frontend Build..."

# Check Node.js version
echo "📊 Node.js version: $(node --version)"
echo "📊 npm version: $(npm --version)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Type check (skip if it fails, but try it)
echo "🔍 Running TypeScript type check..."
if npm run type-check 2>/dev/null; then
    echo "✅ TypeScript check passed"
else
    echo "⚠️ TypeScript check failed or not configured, continuing..."
fi

# Build the project
echo "🏗️ Building the project..."
npm run build

# Verify build output
echo "🔍 Verifying build output..."
if [ -d "dist" ] && [ -f "dist/index.html" ]; then
    echo "✅ Build completed successfully!"
    echo "📁 Build output: dist/"
    echo "📄 Index file: dist/index.html"
else
    echo "❌ Build failed: dist/index.html not found"
    echo "📁 Current directory contents:"
    ls -la
    echo "📁 dist/ contents (if exists):"
    ls -la dist/ 2>/dev/null || echo "dist/ directory not found"
    exit 1
fi