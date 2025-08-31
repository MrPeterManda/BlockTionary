#!/bin/bash
# Blocktionary Vercel Deployment Script

echo "🚀 Starting Vercel deployment..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
  echo "Vercel CLI not found. Installing now..."
  npm install -g vercel
fi

# Run Vercel deployment
vercel --prod

if [ $? -eq 0 ]; then
  echo "✅ Deployment successful!"
else
  echo "❌ Deployment failed"
  exit 1
fi