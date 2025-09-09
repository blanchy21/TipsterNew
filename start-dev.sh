#!/bin/bash

# Kill any existing development servers on ports 3000-3005
echo "🔄 Stopping any existing development servers..."
lsof -ti:3000,3001,3002,3003,3004,3005 | xargs kill -9 2>/dev/null || true

# Wait a moment for ports to be released
sleep 1

# Start the development server on port 3000
echo "🚀 Starting development server on port 3000..."
PORT=3000 npm run dev
