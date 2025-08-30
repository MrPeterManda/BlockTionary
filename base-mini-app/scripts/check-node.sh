#!/bin/bash

# Check Node.js version
REQUIRED_NODE="v20.19.4"
CURRENT_NODE=$(node -v)

if [ "$CURRENT_NODE" != "$REQUIRED_NODE" ]; then
  echo "⚠️  Node.js version mismatch! Required: $REQUIRED_NODE, Current: $CURRENT_NODE"
  exit 1
fi

echo "✅ Node.js version $CURRENT_NODE is compatible"