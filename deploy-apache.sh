#!/bin/bash

# Simple WordCloud API Deployment Script for Apache2
# Usage: ./deploy-apache.sh

set -e

DOMAIN="wordcloud.simonrundell.com"
APP_DIR="/var/www/html/wordcloud"
SERVICE_NAME="wordcloud-api"

echo "🚀 Starting Apache2 deployment for WordCloud API..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Check if PM2 is installed (for process management)
if ! command -v pm2 &> /dev/null; then
    echo "📦 Installing PM2 for process management..."
    sudo npm install -g pm2
fi

# Create application directory
echo "📁 Setting up application directory..."
sudo mkdir -p $APP_DIR
sudo chown $USER:$USER $APP_DIR

# Copy application files
echo "📋 Copying application files..."
cp -r . $APP_DIR/
cd $APP_DIR

# Install dependencies
echo "📦 Installing Node.js dependencies..."
npm install --production

# Create environment file
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please edit $APP_DIR/.env with your production values!"
fi

# Create PM2 ecosystem file
echo "⚙️  Creating PM2 configuration..."
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: '$SERVICE_NAME',
    script: './app-main.js',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    log_file: './logs/combined.log',
    out_file: './logs/out.log',
    error_file: './logs/error.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    max_memory_restart: '1G',
    restart_delay: 4000,
    watch: false
  }]
};
EOF

# Create logs directory
mkdir -p logs

# Enable required Apache modules
echo "🔧 Enabling Apache modules..."
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2enmod ssl
sudo a2enmod headers
sudo a2enmod rewrite

# Copy Apache configuration
echo "🌐 Setting up Apache virtual host..."
sudo cp apache-wordcloud.conf /etc/apache2/sites-available/wordcloud.conf

# Enable the site
sudo a2ensite wordcloud.conf

# Test Apache configuration
echo "🔍 Testing Apache configuration..."
sudo apache2ctl configtest

# Start the Node.js application with PM2
echo "▶️  Starting WordCloud API..."
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# Reload Apache
echo "🔄 Reloading Apache..."
sudo systemctl reload apache2

# Wait for application to start
echo "⏳ Waiting for application to start..."
sleep 5

# Health check
echo "🔍 Performing health check..."
for i in {1..30}; do
    if curl -f http://localhost:3000/health > /dev/null 2>&1; then
        echo "✅ WordCloud API is healthy!"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "❌ Health check failed after 30 attempts"
        pm2 logs $SERVICE_NAME --lines 20
        exit 1
    fi
    echo "⏳ Attempt $i/30 - waiting for API..."
    sleep 2
done

# Show PM2 status
echo "📊 Application status:"
pm2 status

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
echo "   View logs: pm2 logs $SERVICE_NAME"
echo "   Restart: pm2 restart $SERVICE_NAME"
echo "   Stop: pm2 stop $SERVICE_NAME"
echo "   Monitor: pm2 monit"
echo "   Update: git pull && npm install && pm2 restart $SERVICE_NAME"
echo ""
echo "🌐 Production Notes:"
echo "   1. Update SSL certificate paths in /etc/apache2/sites-available/wordcloud.conf"
echo "   2. Ensure DNS points $DOMAIN to this server"
echo "   3. Configure firewall to allow ports 80 and 443"
echo "   4. Monitor with: pm2 monit"
echo "   5. Logs are in: $APP_DIR/logs/"
