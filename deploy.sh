#!/bin/bash

# WordCloud API Deployment Script
# Usage: ./deploy.sh [production|staging]

set -e

ENVIRONMENT=${1:-production}
DOMAIN="wordcloud.simonrundell.com"

echo "🚀 Starting deployment for $ENVIRONMENT environment..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p logs
mkdir -p ssl

# Copy environment file
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env file with your production values!"
    read -p "Press enter to continue after editing .env..."
fi

# Pull latest images
echo "🐳 Pulling Docker images..."
docker-compose pull

# Build the application
echo "🔨 Building WordCloud API..."
docker-compose build

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Start the services
echo "▶️  Starting services..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 10

# Health check
echo "🔍 Performing health check..."
for i in {1..30}; do
    if curl -f http://localhost:3000/health > /dev/null 2>&1; then
        echo "✅ WordCloud API is healthy!"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "❌ Health check failed after 30 attempts"
        docker-compose logs wordcloud-api
        exit 1
    fi
    echo "⏳ Attempt $i/30 - waiting for API..."
    sleep 2
done

# Show running containers
echo "📊 Running containers:"
docker-compose ps

# Show logs
echo "📝 Recent logs:"
docker-compose logs --tail=20

echo ""
echo "🎉 Deployment completed successfully!"
echo ""
echo "📍 API Endpoints:"
echo "   Health: http://localhost:3000/health"
echo "   Simple: http://localhost:3000/wordcloud"
echo "   Advanced: http://localhost:3000/wordcloud/advanced"
echo "   Docs: http://localhost:3000/"
echo ""
echo "🔧 Useful commands:"
echo "   View logs: docker-compose logs -f"
echo "   Restart: docker-compose restart"
echo "   Stop: docker-compose down"
echo "   Update: git pull && docker-compose build && docker-compose up -d"
echo ""

if [ "$ENVIRONMENT" = "production" ]; then
    echo "🌐 Production Notes:"
    echo "   1. Ensure SSL certificates are in ./ssl/ directory"
    echo "   2. Update DNS to point $DOMAIN to this server"
    echo "   3. Configure firewall to allow ports 80 and 443"
    echo "   4. Consider setting up log rotation"
    echo "   5. Monitor with: docker-compose logs -f"
fi
