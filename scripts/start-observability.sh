#!/bin/bash
# Start the Zeal Observability Stack
# Usage: ./scripts/start-observability.sh [up|down|logs|status]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
COMPOSE_FILE="$PROJECT_ROOT/infrastructure/observability/docker-compose.observability.yml"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[Observability]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[Warning]${NC} $1"
}

print_error() {
    echo -e "${RED}[Error]${NC} $1"
}

case "${1:-up}" in
    up|start)
        print_status "Starting observability stack..."
        docker-compose -f "$COMPOSE_FILE" up -d

        echo ""
        print_status "Observability stack started!"
        echo ""
        echo "Services:"
        echo "  - Grafana:        http://localhost:3003 (admin/admin)"
        echo "  - Prometheus:     http://localhost:9090"
        echo "  - Loki:           http://localhost:3100"
        echo "  - Tempo:          http://localhost:3200"
        echo "  - OTel Collector: http://localhost:4318 (HTTP)"
        echo ""
        echo "To enable observability in services, set:"
        echo "  OBSERVABILITY_ENABLED=true"
        echo ""
        ;;

    down|stop)
        print_status "Stopping observability stack..."
        docker-compose -f "$COMPOSE_FILE" down
        print_status "Observability stack stopped."
        ;;

    logs)
        docker-compose -f "$COMPOSE_FILE" logs -f "${@:2}"
        ;;

    status|ps)
        docker-compose -f "$COMPOSE_FILE" ps
        ;;

    restart)
        print_status "Restarting observability stack..."
        docker-compose -f "$COMPOSE_FILE" restart
        print_status "Observability stack restarted."
        ;;

    clean)
        print_warning "This will remove all observability data (volumes)!"
        read -p "Are you sure? (y/N) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            docker-compose -f "$COMPOSE_FILE" down -v
            print_status "Observability stack and data removed."
        fi
        ;;

    health)
        echo "Checking service health..."
        echo ""
        echo -n "OTel Collector: "
        curl -s http://localhost:13133/ > /dev/null && echo "OK" || echo "DOWN"
        echo -n "Prometheus:     "
        curl -s http://localhost:9090/-/healthy > /dev/null && echo "OK" || echo "DOWN"
        echo -n "Loki:           "
        curl -s http://localhost:3100/ready > /dev/null && echo "OK" || echo "DOWN"
        echo -n "Tempo:          "
        curl -s http://localhost:3200/ready > /dev/null && echo "OK" || echo "DOWN"
        echo -n "Grafana:        "
        curl -s http://localhost:3003/api/health > /dev/null && echo "OK" || echo "DOWN"
        ;;

    *)
        echo "Zeal Observability Stack Management"
        echo ""
        echo "Usage: $0 [command]"
        echo ""
        echo "Commands:"
        echo "  up, start   Start the observability stack"
        echo "  down, stop  Stop the observability stack"
        echo "  restart     Restart all services"
        echo "  logs        View logs (optionally specify service name)"
        echo "  status, ps  Show running services"
        echo "  health      Check health of all services"
        echo "  clean       Stop and remove all data (volumes)"
        echo ""
        exit 1
        ;;
esac
