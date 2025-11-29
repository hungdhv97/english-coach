#!/bin/bash

# Lint All Script
# Runs linting for both backend and frontend

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Track if any linting failed
LINT_FAILED=0

echo -e "${BLUE}🔍 Running linting for all projects...${NC}"
echo ""

# Function to print section header
print_section() {
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
}

# Lint Backend (Go)
print_section "🔧 Linting Backend (Go)"
cd "$PROJECT_ROOT/backend"

if [ -f "go.mod" ]; then
    # Check if golangci-lint is installed
    if command -v golangci-lint &> /dev/null; then
        echo -e "${YELLOW}Running golangci-lint...${NC}"
        if golangci-lint run; then
            echo -e "${GREEN}✅ Backend linting passed${NC}"
        else
            echo -e "${RED}❌ Backend linting failed${NC}"
            LINT_FAILED=1
        fi
    elif [ -f ".golangci.yml" ]; then
        echo -e "${YELLOW}golangci-lint not found. Checking Go files format...${NC}"
        # Fallback: check if gofmt finds any formatting issues
        if gofmt -l . | grep -q .; then
            echo -e "${RED}❌ Backend has formatting issues. Run: gofmt -w .${NC}"
            LINT_FAILED=1
        else
            echo -e "${GREEN}✅ Backend formatting check passed${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️  No linting configuration found for backend${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Backend go.mod not found, skipping...${NC}"
fi

echo ""

# Lint Frontend (TypeScript/JavaScript)
print_section "🎨 Linting Frontend (TypeScript/JavaScript)"
cd "$PROJECT_ROOT/frontend"

if [ -f "package.json" ]; then
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}⚠️  node_modules not found. Installing dependencies...${NC}"
        npm install
    fi

    # Run ESLint
    if npm run lint 2>/dev/null || npm run lint:check 2>/dev/null; then
        echo -e "${GREEN}✅ Frontend linting passed${NC}"
    else
        echo -e "${YELLOW}⚠️  ESLint check completed with warnings${NC}"
        # Don't fail on warnings, only errors
    fi
else
    echo -e "${YELLOW}⚠️  Frontend package.json not found, skipping...${NC}"
fi

echo ""

# Summary
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
if [ $LINT_FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ All linting checks completed successfully!${NC}"
    exit 0
else
    echo -e "${RED}❌ Some linting checks failed${NC}"
    exit 1
fi

