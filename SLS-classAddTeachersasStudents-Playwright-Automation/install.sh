#!/bin/bash

# SLS Playwright Automation - Installation Script
# This script sets up the automation environment

echo "🚀 SLS Playwright Automation - Installation Script"
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js (version 16 or higher) first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16 or higher is required. Current version: $(node -v)"
    echo "   Please update Node.js from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install npm dependencies
echo "📦 Installing npm dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install npm dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Install Playwright browsers
echo "🌐 Installing Playwright browsers..."
npx playwright install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install Playwright browsers"
    exit 1
fi

echo "✅ Playwright browsers installed successfully"

# Create directories if they don't exist
mkdir -p logs screenshots

echo "📁 Created logs and screenshots directories"

# Check if data.csv exists
if [ ! -f "data.csv" ]; then
    echo "📋 IMPORTANT: You need to create your data.csv file!"
    echo ""
    echo "   Quick setup:"
    echo "   1. Copy sample: cp data-sample.csv data.csv"
    echo "   2. Edit data.csv with your teacher emails"
    echo ""
    echo "   📖 For detailed help, read: DATA-SETUP.md"
    echo "   (Covers Excel, Google Sheets, and troubleshooting)"
    echo ""
    echo "   Expected format:"
    echo "   SerialNo,Email"
    echo "   1,teacher1@moe.edu.sg"
    echo "   2,teacher2@moe.edu.sg"
fi

echo ""
echo "🎉 Installation completed successfully!"
echo ""
echo "Next steps:"
echo "1. Ensure your data.csv file is in this directory"
echo "2. Run the automation with: npm start"
echo "3. Or read the README.md for detailed instructions"
echo ""
echo "Happy automating! 🤖"
