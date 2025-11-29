#!/bin/bash

# Migration Script
# This script provides instructions for running database migrations

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

echo -e "${BLUE}🗄️  Database Migration Guide${NC}"
echo ""
echo -e "${YELLOW}This script provides instructions for running database migrations.${NC}"
echo ""

# Check if PostgreSQL is accessible
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Option 1: Run Migration Locally (Go)${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "Prerequisites:"
echo "  • PostgreSQL database running"
echo "  • Database credentials configured in backend.env"
echo ""
echo "Steps:"
echo ""
echo "1. Ensure PostgreSQL is running:"
echo "   docker-compose -f deploy/compose/docker-compose.yml up -d postgres"
echo ""
echo "2. Set database connection string (optional, defaults provided):"
echo "   export DB_DSN='postgres://postgres:postgres@localhost:5432/english_coach?sslmode=disable'"
echo ""
echo "3. Run migration from backend directory:"
echo "   cd backend"
echo "   go run cmd/migration/main.go"
echo ""
echo "Or build and run:"
echo "   cd backend"
echo "   go build -o bin/migration cmd/migration/main.go"
echo "   ./bin/migration"
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Option 2: Run Migration via Docker${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "Steps:"
echo ""
echo "1. Build the migration container:"
echo "   docker build -f deploy/docker/backend/Dockerfile -t english-coach-migration backend/"
echo ""
echo "2. Run migration:"
echo "   docker run --rm \\"
echo "     --network english-coach-network \\"
echo "     -e DB_DSN='postgres://postgres:postgres@postgres:5432/english_coach?sslmode=disable' \\"
echo "     -v \"\$(pwd)/backend:/app\" \\"
echo "     english-coach-migration \\"
echo "     go run cmd/migration/main.go"
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Option 3: Run Migration Manually (psql)${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "If you prefer to run SQL directly:"
echo ""
echo "1. Connect to PostgreSQL:"
echo "   psql -h localhost -U postgres -d english_coach"
echo ""
echo "2. Run the migration file:"
echo "   \\i backend/internal/infrastructure/db/migrations/0001_init.sql"
echo ""
echo "Or from command line:"
echo "   psql -h localhost -U postgres -d english_coach -f backend/internal/infrastructure/db/migrations/0001_init.sql"
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Verification${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "After running migration, verify tables were created:"
echo "   psql -h localhost -U postgres -d english_coach -c \"\\dt\""
echo ""
echo -e "${GREEN}For more details, see: backend/internal/infrastructure/db/migrations/0001_init.sql${NC}"
echo ""

