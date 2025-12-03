#!/bin/bash

# Amazon Replica Quick Start Script
echo "🚀 Starting Amazon Replica Application..."

# SQLite is used - no database service needed
echo "✅ Using SQLite database (no service required)"

# Check if backend dependencies are installed
if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd backend && npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install backend dependencies"
        exit 1
    fi
    cd ..
fi

# Check if frontend dependencies are installed
if [ ! -d "client/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd client && npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install frontend dependencies"
        exit 1
    fi
    cd ..
fi

# Import sample data if needed
echo "📊 Checking sample data..."
if [ ! -f "backend/database.sqlite" ]; then
    echo "📊 Importing sample data..."
    cd backend && npm run data:import
    if [ $? -ne 0 ]; then
        echo "⚠️ Warning: Failed to import sample data"
    fi
    cd ..
else
    echo "✅ Database already exists"
fi

echo "✅ Setup complete!"
echo ""
echo "🎯 To start the application:"
echo "1. Backend: cd backend && npm run dev"
echo "2. Frontend: cd client && npm run dev"
echo ""
echo "🌐 Access the app at: http://localhost:5173"
echo "🔧 API runs at: http://localhost:5000"