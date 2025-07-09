#!/bin/bash

echo "🔨 Building SLS Automation Executables"
echo "======================================"

# Check if pkg is installed
if ! command -v pkg &> /dev/null; then
    echo "📦 Installing pkg..."
    npm install -g pkg
fi

# Create dist directory
mkdir -p dist

echo "🏗️  Building executables for all platforms..."

# Build for all platforms
npm run build-all

if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    echo ""
    echo "📁 Copying required files to dist folder..."
    cp config.json dist/ 2>/dev/null || echo "⚠️  config.json not found"
    cp data-sample.csv dist/ 2>/dev/null || echo "⚠️  data-sample.csv not found"
    echo ""
    echo "📁 Generated files in dist/ folder:"
    ls -la dist/
    echo ""
    echo "📋 Distribution packages:"
    echo "- Windows: sls-playwright-automation-win.exe"
    echo "- macOS: sls-playwright-automation-macos"
    echo "- Linux: sls-playwright-automation-linux"
    echo ""
    echo "📤 To distribute:"
    echo "1. Copy the appropriate executable for each platform"
    echo "2. Include data-sample.csv and config.json in the same folder"
    echo "3. Users just need to:"
    echo "   - Create their data.csv file"
    echo "   - Double-click the executable"
    echo ""
    echo "🎉 Ready for distribution!"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi
