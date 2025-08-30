#!/bin/bash

# Check if required dependencies are installed
if [ ! -d "node_modules" ]; then
  echo "⚠️  Dependencies not installed. Run 'make install' first."
  exit 1
fi

echo "✅ All dependencies are installed"