#!/bin/bash

# Check Node.js version script
echo "🔍 Checking Node.js installation..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "📥 Installing Node.js 20+ using nvm..."
    
    # Install nvm if not present
    if ! command -v nvm &> /dev/null; then
        echo "Installing Node Version Manager (nvm)..."
        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
        
        # Source nvm for current session
        export NVM_DIR="$HOME/.nvm"
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
        [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
    fi
    
    # Install and use Node.js 20
    nvm install 20
    nvm use 20
    nvm alias default 20
else
    # Check Node.js version
    NODE_VERSION=$(node -v | cut -d'v' -f2)
    NODE_MAJOR=$(echo $NODE_VERSION | cut -d'.' -f1)
    
    echo "📋 Current Node.js version: v$NODE_VERSION"
    
    if [ "$NODE_MAJOR" -lt 20 ]; then
        echo "⚠️  Node.js version is too old (need 20+)"
        echo "📥 Upgrading to Node.js 20..."
        
        # Install nvm if not present
        if ! command -v nvm &> /dev/null; then
            curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
            export NVM_DIR="$HOME/.nvm"
            [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
        fi
        
        nvm install 20
        nvm use 20
        nvm alias default 20
    else
        echo "✅ Node.js version is compatible"
    fi
fi

# Verify final installation
echo "🎯 Final Node.js version: $(node -v)"
echo "🎯 NPM version: $(npm -v)"
