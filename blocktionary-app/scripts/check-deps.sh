#!/bin/bash

echo "🔍 Checking project dependencies..."

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found!"
    echo "Run 'make install' to set up the project."
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "❌ node_modules not found!"
    echo "Run 'make install' to install dependencies."
    exit 1
fi

# Check critical files
FILES_TO_CHECK=(
    "app/layout.tsx"
    "app/page.tsx" 
    "components/Blocktionary.tsx"
    "data/questions.ts"
    "tailwind.config.js"
    "next.config.js"
)

echo "📋 Checking project files..."
for file in "${FILES_TO_CHECK[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file (missing)"
    fi
done

echo "🎯 Dependency check complete!"
