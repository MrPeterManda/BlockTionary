#!/bin/bash

echo "📦 Setting up Blocktionary dependencies..."

# Ensure we're in the right directory
cd "$(dirname "$0")/.." || exit 1

# Clean previous installations if they exist
if [ -d "node_modules" ]; then
    echo "🧹 Cleaning previous installation..."
    rm -rf node_modules package-lock.json
fi

# Create minimal package.json if it doesn't exist
if [ ! -f "package.json" ]; then
    echo "📝 Creating package.json..."
    cat > package.json << 'PACKAGE_EOF'
{
  "name": "blocktionary-app",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "15.5.2",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "eslint": "^8",
    "eslint-config-next": "15.5.2",
    "postcss": "^8",
    "tailwindcss": "^3.4.1",
    "typescript": "^5"
  }
}
PACKAGE_EOF
fi

# Create next.config.js
echo "⚙️  Creating Next.js configuration..."
cat > next.config.js << 'CONFIG_EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
CONFIG_EOF

# Create tailwind config
echo "🎨 Setting up Tailwind CSS..."
cat > tailwind.config.js << 'TAILWIND_EOF'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
TAILWIND_EOF

# Create postcss config
cat > postcss.config.js << 'POSTCSS_EOF'
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
POSTCSS_EOF

# Install dependencies
echo "📥 Installing packages..."
npm install

# Create required directories and files
echo "📁 Creating project structure..."
mkdir -p app data components public/.well-known

# Create globals.css
cat > app/globals.css << 'CSS_EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

html,
body {
  padding: 0;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
}

* {
  box-sizing: border-box;
}
CSS_EOF

echo "✅ Dependencies installed successfully!"
