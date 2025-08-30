# Blocktionary Development Makefile
# Automates setup, development, and deployment

.PHONY: help setup install dev build deploy clean check-node check-deps test-build

# Default target
help:
	@echo "🚀 Blocktionary Development Commands"
	@echo "=================================="
	@echo "setup     - Complete project setup (Node.js, deps, build, run)"
	@echo "install   - Install/update all dependencies"
	@echo "dev       - Start development server"
	@echo "build     - Build production version"
	@echo "deploy    - Deploy to Vercel"
	@echo "clean     - Clean build artifacts and node_modules"
	@echo "check     - Check system requirements"
	@echo "reset     - Complete reset and fresh setup"
	@echo ""
	@echo "Quick start: make setup"

# Complete setup from scratch
setup: check-node install build dev

# Check Node.js version requirement
check-node:
	@echo "🔍 Checking Node.js version..."
	@./scripts/check-node.sh

# Install dependencies
install: check-node
	@echo "📦 Installing dependencies..."
	@./scripts/install-deps.sh

# Start development server
dev:
	@echo "🚀 Starting development server..."
	@echo "Opening http://localhost:3000"
	@PORT=3000 npm run dev

# Build for production
build:
	@echo "🏗️  Building production version..."
	@npm run build

# Deploy to Vercel
deploy:
	@echo "🚀 Deploying to Vercel..."
	@./scripts/deploy.sh
	@echo "✅ Deployment complete"

# Clean build artifacts
clean:
	@echo "🧹 Cleaning build artifacts..."
	@rm -rf .next node_modules package-lock.json
	@echo "✅ Clean complete"

# Check system requirements
check: check-node check-deps

# Check if dependencies are installed
check-deps:
	@echo "🔍 Checking dependencies..."
	@./scripts/check-deps.sh

# Test build process
test-build: install build
	@echo "✅ Build test complete"

# Complete reset and fresh setup
reset: clean setup
	@echo "✅ Complete reset finished"

# Quick development restart
restart:
	@echo "🔄 Restarting development..."
	@pkill -f "next dev" || true
	@sleep 2
	@make dev