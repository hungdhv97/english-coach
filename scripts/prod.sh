#!/bin/bash

# Production Environment Management Script
# Manages production deployment using docker-compose with prod profile

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
COMPOSE_FILE="$PROJECT_ROOT/deploy/compose/docker-compose.yml"
ENV_DIR="$PROJECT_ROOT/deploy/env/prod"

# Default command
COMMAND="${1:-help}"

show_help() {
    echo -e "${BLUE}🚀 LexiGo Production Environment Management${NC}"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  up, start         Start all production services (detached mode)"
    echo "  down, stop        Stop all production services"
    echo "  restart           Restart all production services"
    echo "  build             Build production images"
    echo "  logs              Show logs from all services (use --follow or -f to follow)"
    echo "  ps, status        Show status of production services"
    echo "  pull              Pull latest images for services"
    echo "  help, -h, --help  Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 up              # Start production services"
    echo "  $0 down            # Stop production services"
    echo "  $0 restart         # Restart production services"
    echo "  $0 logs            # Show recent logs"
    echo "  $0 logs -f         # Follow logs"
    echo "  $0 build           # Build production images"
    echo ""
}

# Check if docker-compose is available
check_docker_compose() {
    if ! command -v docker-compose &> /dev/null && ! command -v docker &> /dev/null; then
        echo -e "${RED}❌ Error: docker-compose or docker is not installed${NC}"
        exit 1
    fi

    # Use docker compose (v2) if available, otherwise fall back to docker-compose (v1)
    if docker compose version &> /dev/null; then
        DOCKER_COMPOSE="docker compose"
    elif command -v docker-compose &> /dev/null; then
        DOCKER_COMPOSE="docker-compose"
    else
        echo -e "${RED}❌ Error: docker compose is not available${NC}"
        exit 1
    fi
}

# Check if production env files exist
check_env_files() {
    if [ ! -f "$ENV_DIR/backend.env" ]; then
        echo -e "${RED}❌ Error: Production backend.env not found at $ENV_DIR/backend.env${NC}"
        exit 1
    fi

    if [ ! -f "$ENV_DIR/frontend.env" ]; then
        echo -e "${RED}❌ Error: Production frontend.env not found at $ENV_DIR/frontend.env${NC}"
        exit 1
    fi

    # Warn about placeholder values in backend.env
    if grep -q "change-me-in-production" "$ENV_DIR/backend.env"; then
        echo -e "${YELLOW}⚠️  Warning: backend.env contains placeholder values that should be changed!${NC}"
        echo -e "${YELLOW}   Please review $ENV_DIR/backend.env before deploying to production${NC}"
        echo ""
        read -p "Continue anyway? (yes/no): " -r
        if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
            echo -e "${RED}Aborted.${NC}"
            exit 1
        fi
        echo ""
    fi
}

# Check if compose file exists
check_compose_file() {
    if [ ! -f "$COMPOSE_FILE" ]; then
        echo -e "${RED}❌ Error: Docker compose file not found at $COMPOSE_FILE${NC}"
        exit 1
    fi
}

# Change to project root
cd "$PROJECT_ROOT"

# Set environment variables for docker-compose
export ENV=prod

# Handle commands
case "$COMMAND" in
    up|start)
        echo -e "${GREEN}🚀 Starting LexiGo Production Environment${NC}"
        echo ""
        check_docker_compose
        check_compose_file
        check_env_files
        
        echo -e "${YELLOW}📦 Starting services with prod profile...${NC}"
        $DOCKER_COMPOSE -f "$COMPOSE_FILE" --profile prod up --build -d
        
        echo ""
        echo -e "${GREEN}✓ Production services started successfully!${NC}"
        echo ""
        echo -e "${BLUE}Use '${SCRIPT_DIR}/prod.sh logs' to view logs${NC}"
        echo -e "${BLUE}Use '${SCRIPT_DIR}/prod.sh ps' to check status${NC}"
        ;;
        
    down|stop)
        echo -e "${YELLOW}🛑 Stopping LexiGo Production Environment${NC}"
        echo ""
        check_docker_compose
        check_compose_file
        
        # Safety confirmation for production
        echo -e "${RED}⚠️  WARNING: This will stop all production services!${NC}"
        echo ""
        read -p "Are you sure you want to continue? (yes/no): " -r
        if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
            echo -e "${YELLOW}Aborted.${NC}"
            exit 0
        fi
        echo ""
        
        echo -e "${YELLOW}📦 Stopping services...${NC}"
        $DOCKER_COMPOSE -f "$COMPOSE_FILE" --profile prod down
        
        echo ""
        echo -e "${GREEN}✓ Production services stopped successfully!${NC}"
        ;;
        
    restart)
        echo -e "${YELLOW}🔄 Restarting LexiGo Production Environment${NC}"
        echo ""
        check_docker_compose
        check_compose_file
        check_env_files
        
        echo -e "${YELLOW}📦 Restarting services...${NC}"
        $DOCKER_COMPOSE -f "$COMPOSE_FILE" --profile prod restart
        
        echo ""
        echo -e "${GREEN}✓ Production services restarted successfully!${NC}"
        ;;
        
    build)
        echo -e "${BLUE}🔨 Building LexiGo Production Images${NC}"
        echo ""
        check_docker_compose
        check_compose_file
        check_env_files
        
        echo -e "${YELLOW}📦 Building production images...${NC}"
        $DOCKER_COMPOSE -f "$COMPOSE_FILE" --profile prod build
        
        echo ""
        echo -e "${GREEN}✓ Production images built successfully!${NC}"
        echo -e "${BLUE}Use '${SCRIPT_DIR}/prod.sh up' to start services${NC}"
        ;;
        
    logs)
        check_docker_compose
        check_compose_file
        
        # Pass remaining arguments to logs command (e.g., -f, --follow, --tail, etc.)
        shift
        $DOCKER_COMPOSE -f "$COMPOSE_FILE" --profile prod logs "$@"
        ;;
        
    ps|status)
        check_docker_compose
        check_compose_file
        
        echo -e "${BLUE}📊 Production Services Status${NC}"
        echo ""
        $DOCKER_COMPOSE -f "$COMPOSE_FILE" --profile prod ps
        ;;
        
    pull)
        echo -e "${BLUE}📥 Pulling Latest Images for Production${NC}"
        echo ""
        check_docker_compose
        check_compose_file
        
        echo -e "${YELLOW}📦 Pulling images...${NC}"
        $DOCKER_COMPOSE -f "$COMPOSE_FILE" --profile prod pull
        
        echo ""
        echo -e "${GREEN}✓ Images pulled successfully!${NC}"
        ;;
        
    help|-h|--help)
        show_help
        ;;
        
    *)
        echo -e "${RED}❌ Unknown command: $COMMAND${NC}"
        echo ""
        show_help
        exit 1
        ;;
esac

