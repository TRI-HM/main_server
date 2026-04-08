#!/bin/bash
# setup-vps.sh - Script to optimize Ubuntu 24.04 for 3GB RAM deployment
# Directory structure:
#   /var/www/wonderfarm/
#   ├── frontend/
#   │   ├── main/    # wonderfarmsieusaothanhmat.com
#   │   └── demo/    # demo.wonderfarmsieusaothanhmat.com
#   └── backend/     # Node Express + Docker

set -e

echo "🚀 Setting up VPS optimization for 3GB RAM (Ubuntu 24.04)..."

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install essential tools
echo "🛠️ Installing essential tools..."
sudo apt install -y htop nano wget curl git rsync ufw

# Install Nginx
echo "🌐 Installing Nginx..."
sudo apt install -y nginx
sudo systemctl enable nginx

# Install Docker (official method for Ubuntu)
echo "🐳 Installing Docker..."
sudo apt install -y ca-certificates gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER

# Create swap file (4GB swap for 3GB RAM)
echo "💾 Creating swap file..."
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Make swap permanent
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Optimize swap usage
echo "⚡ Optimizing swap settings..."
echo 'vm.swappiness=10' | sudo tee -a /etc/sysctl.conf
echo 'vm.vfs_cache_pressure=50' | sudo tee -a /etc/sysctl.conf

# Set up log rotation to prevent disk space issues
echo "📝 Setting up log rotation..."
sudo tee /etc/logrotate.d/docker > /dev/null <<EOF
/var/lib/docker/containers/*/*.log {
    rotate 5
    weekly
    compress
    size 10M
    copytruncate
    missingok
    notifempty
}
EOF

# Configure Docker daemon for memory optimization
echo "🔧 Configuring Docker daemon..."
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json > /dev/null <<EOF
{
    "log-driver": "json-file",
    "log-opts": {
        "max-size": "10m",
        "max-file": "3"
    },
    "default-ulimits": {
        "nofile": {
            "name": "nofile",
            "hard": 65536,
            "soft": 65536
        }
    }
}
EOF

sudo systemctl restart docker

# Create project directories
echo "📁 Creating project directories..."
sudo mkdir -p /var/www/wonderfarm/frontend/main
sudo mkdir -p /var/www/wonderfarm/frontend/demo
sudo mkdir -p /var/www/wonderfarm/backend/uploads
sudo mkdir -p /var/www/backups
sudo chown -R $USER:$USER /var/www/wonderfarm
sudo chown -R $USER:$USER /var/www/backups

# Configure Nginx - copy config files from documents/deploy/
echo "🌐 Configuring Nginx..."
echo "⚠️  Copy nginx config files manually:"
echo "    sudo mkdir -p /etc/nginx/snippets"
echo "    sudo cp documents/deploy/wonderfarm-common.conf /etc/nginx/snippets/"
echo "    sudo cp documents/deploy/wonderfarm.nginx.conf /etc/nginx/sites-available/wonderfarm"
echo "    sudo ln -s /etc/nginx/sites-available/wonderfarm /etc/nginx/sites-enabled/"
echo "    sudo rm -f /etc/nginx/sites-enabled/default"

# Ubuntu 24.04 already has sites-available/sites-enabled/snippets
sudo rm -f /etc/nginx/sites-enabled/default

# Configure UFW firewall
echo "🔒 Configuring UFW firewall..."
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

# Set up monitoring script
echo "📊 Setting up monitoring script..."
sudo tee /usr/local/bin/check-resources.sh > /dev/null <<'EOF'
#!/bin/bash
# Resource monitoring script

MEMORY_THRESHOLD=85
DISK_THRESHOLD=80

# Check memory usage
MEMORY_USAGE=$(free | grep Mem | awk '{printf("%.0f", $3/$2 * 100.0)}')
if [ $MEMORY_USAGE -gt $MEMORY_THRESHOLD ]; then
    echo "$(date): WARNING - Memory usage is ${MEMORY_USAGE}%" >> /var/log/resource-monitor.log
fi

# Check disk usage
DISK_USAGE=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt $DISK_THRESHOLD ]; then
    echo "$(date): WARNING - Disk usage is ${DISK_USAGE}%" >> /var/log/resource-monitor.log
fi

# Log current resource usage
echo "$(date): Memory: ${MEMORY_USAGE}%, Disk: ${DISK_USAGE}%" >> /var/log/resource-usage.log
EOF

sudo chmod +x /usr/local/bin/check-resources.sh

# Add to crontab to run every 5 minutes
(crontab -l 2>/dev/null; echo "*/5 * * * * /usr/local/bin/check-resources.sh") | crontab -

# Create cleanup script for Docker
echo "🧹 Setting up Docker cleanup..."
sudo tee /usr/local/bin/docker-cleanup.sh > /dev/null <<'EOF'
#!/bin/bash
# Docker cleanup script to free up space

echo "Starting Docker cleanup..."

# Remove stopped containers
docker container prune -f

# Remove unused images (keep only recent ones)
docker image prune -a -f --filter "until=72h"

# Remove unused volumes
docker volume prune -f

# Remove unused networks
docker network prune -f

echo "Docker cleanup completed"
EOF

sudo chmod +x /usr/local/bin/docker-cleanup.sh

# Schedule cleanup weekly
(crontab -l 2>/dev/null; echo "0 2 * * 0 /usr/local/bin/docker-cleanup.sh >> /var/log/docker-cleanup.log 2>&1") | crontab -

echo ""
echo "✅ VPS setup completed!"
echo "📋 Summary:"
echo "  - Nginx installed and configured"
echo "  - Docker installed and optimized"
echo "  - 4GB Swap file created"
echo "  - Resource monitoring enabled"
echo "  - Automatic cleanup scheduled"
echo ""
echo "📂 Directory structure:"
echo "  /var/www/wonderfarm/"
echo "  ├── frontend/"
echo "  │   ├── main/    # wonderfarmsieusaothanhmat.com"
echo "  │   └── demo/    # demo.wonderfarmsieusaothanhmat.com"
echo "  └── backend/     # git clone backend here"
echo ""
echo "🚀 Next steps:"
echo "  1. sudo reboot"
echo "  2. Copy nginx configs:"
echo "     sudo cp wonderfarm-common.conf /etc/nginx/snippets/"
echo "     sudo cp wonderfarm.nginx.conf /etc/nginx/sites-available/wonderfarm"
echo "     sudo ln -s /etc/nginx/sites-available/wonderfarm /etc/nginx/sites-enabled/"
echo "     sudo nginx -t && sudo systemctl reload nginx"
echo "  3. cd /var/www/wonderfarm/backend && git clone <repo-url> ."
echo "  4. cp .env.example .env && nano .env"
echo "  5. bash deploy.sh"
echo "  6. rsync frontend builds:"
echo "     rsync -avz ./out/ root@VPS:/var/www/wonderfarm/frontend/main/"
echo "     rsync -avz ./out/ root@VPS:/var/www/wonderfarm/frontend/demo/"
echo ""
echo "📈 To monitor: htop or cat /var/log/resource-usage.log"