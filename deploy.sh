#!/bin/bash
# deploy.sh - Production deployment script

echo "🚀 Starting production deployment..."

# Variables
PROJECT_DIR="/opt/main_server"
BACKUP_DIR="/opt/backups"
APP_NAME="main_server"

# Create backup directory
mkdir -p $BACKUP_DIR

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

# Backup current deployment
if [ -d "$PROJECT_DIR" ]; then
    echo "💾 Creating backup..."
    tar -czf "$BACKUP_DIR/backup-$(date +%Y%m%d_%H%M%S).tar.gz" -C "$PROJECT_DIR" .
    
    # Keep only last 5 backups
    ls -t $BACKUP_DIR/backup-*.tar.gz | tail -n +6 | xargs -r rm
fi

# Navigate to project directory
cd $PROJECT_DIR

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
    latest_backup=$(ls -t $BACKUP_DIR/backup-*.tar.gz 2>/dev/null | head -n 1)
    if [ -n "$latest_backup" ]; then
        echo "🔄 Rolling back to latest backup..."
        docker compose down
        rm -rf $PROJECT_DIR/*
        tar -xzf "$latest_backup" -C "$PROJECT_DIR"
        docker compose up -d
    fi
    exit 1
fi

# Run database migrations
echo "🔄 Running database migrations..."
docker compose exec app npx sequelize-cli db:migrate

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

echo "✅ Deployment completed successfully!"
echo "🌐 Application is available at: http://171.244.201.165:9456"