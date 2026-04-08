#!/bin/bash
# deploy.sh - Production deployment script
# Directory structure:
#   /var/www/wonderfarm/
#   ├── frontend/out/    # Next.js static export (rsync from local)
#   └── backend/         # This project (Node Express + Docker)

set -e

echo "🚀 Starting production deployment..."

# Variables
BASE_DIR="/var/www/wonderfarm"
BACKEND_DIR="$BASE_DIR/backend"
FRONTEND_DIR="$BASE_DIR/frontend"
BACKUP_DIR="/var/www/backups"

# Create directories
mkdir -p "$BACKUP_DIR"
mkdir -p "$FRONTEND_DIR/out"
mkdir -p "$BACKEND_DIR/uploads"

# Function to check if containers are running
check_health() {
    local container=$1
    local retries=30
    local count=0

    echo "🔍 Checking health of $container..."
    while [ $count -lt $retries ]; do
        if docker compose ps $container | grep -q "healthy\|running"; then
            echo "✅ $container is healthy"
            return 0
        fi
        echo "⏳ Waiting for $container to be ready... ($count/$retries)"
        sleep 10
        ((count++))
    done

    echo "❌ $container failed to start properly"
    return 1
}

# Backup current backend deployment
if [ -d "$BACKEND_DIR/src" ]; then
    echo "💾 Creating backup..."
    tar -czf "$BACKUP_DIR/backend-$(date +%Y%m%d_%H%M%S).tar.gz" \
        --exclude='node_modules' \
        --exclude='uploads' \
        -C "$BACKEND_DIR" .

    # Keep only last 5 backups
    ls -t "$BACKUP_DIR"/backend-*.tar.gz 2>/dev/null | tail -n +6 | xargs -r rm
fi

# Navigate to backend directory
cd "$BACKEND_DIR"

# Pull latest changes (if using git)
if [ -d ".git" ]; then
    echo "📥 Pulling latest changes..."
    git pull origin main
fi

# Build and start services
echo "🏗️ Building and starting services..."

# Stop existing containers gracefully
docker compose down --timeout 30

# Clean up old images to save space
docker image prune -f

# Build new images
docker compose build --no-cache

# Start database first
echo "🗄️ Starting database..."
docker compose up -d db

# Wait for database to be ready
if ! check_health "db"; then
    echo "❌ Database failed to start. Aborting deployment."
    exit 1
fi

# Start application
echo "🚀 Starting application..."
docker compose up -d app

# Wait for application to be ready
if ! check_health "app"; then
    echo "❌ Application failed to start. Rolling back..."

    # Rollback: restore from backup if available
    latest_backup=$(ls -t "$BACKUP_DIR"/backend-*.tar.gz 2>/dev/null | head -n 1)
    if [ -n "$latest_backup" ]; then
        echo "🔄 Rolling back to latest backup..."
        docker compose down
        tar -xzf "$latest_backup" -C "$BACKEND_DIR"
        docker compose up -d
    fi
    exit 1
fi

# Check final status
echo "🔍 Final health check..."
sleep 10

APP_STATUS=$(docker compose ps app --format "table {{.Status}}" | tail -n 1)
DB_STATUS=$(docker compose ps db --format "table {{.Status}}" | tail -n 1)

echo "📊 Deployment Status:"
echo "  📱 App: $APP_STATUS"
echo "  🗄️ DB: $DB_STATUS"

# Show resource usage
echo "💾 Current resource usage:"
free -h
df -h

# Show application logs (last 20 lines)
echo "📝 Recent application logs:"
docker compose logs --tail=20 app

echo ""
echo "✅ Deployment completed successfully!"
echo "📂 Frontend: $FRONTEND_DIR/out/"
echo "📂 Backend:  $BACKEND_DIR/"
echo "🌐 Backend API: http://127.0.0.1:9456"