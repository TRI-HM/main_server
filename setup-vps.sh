#!/bin/bash
# setup-vps.sh - Script to optimize CentOS 7.9 for 3GB RAM deployment

echo "🚀 Setting up VPS optimization for 3GB RAM..."

# Update system
echo "📦 Updating system packages..."
sudo yum update -y
sudo yum install -y epel-release

# Install essential tools
echo "🛠️ Installing essential tools..."
sudo yum install -y htop nano wget curl git

# Install Docker
echo "🐳 Installing Docker..."
sudo yum install -y yum-utils device-mapper-persistent-data lvm2
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
sudo yum install -y docker-ce docker-ce-cli containerd.io
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER

# Install Docker Compose
echo "🐙 Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

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

# Create deployment directory
echo "📁 Creating deployment directory..."
mkdir -p /opt/main_server
sudo chown $USER:$USER /opt/main_server

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

echo "✅ VPS optimization completed!"
echo "📋 Summary:"
echo "  - 4GB Swap file created"
echo "  - Docker installed and optimized"
echo "  - Resource monitoring enabled"
echo "  - Automatic cleanup scheduled"
echo ""
echo "⚠️  Please reboot the system to apply all changes:"
echo "   sudo reboot"
echo ""
echo "📈 To monitor resources: htop or cat /var/log/resource-usage.log"