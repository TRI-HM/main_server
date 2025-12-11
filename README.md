# Đây là các bước triển khai dự án Node.js của bạn lên VPS CentOS 7.9

## 1. Cập nhật hệ thống và cài đặt Docker

sudo yum update -y
sudo yum install -y epel-release
sudo yum install -y yum-utils device-mapper-persistent-data lvm2
sudo yum-config-manager --add-repo <https://download.docker.com/linux/centos/docker-ce.repo>
sudo yum install -y docker-ce docker-ce-cli containerd.io
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER

## 2. Cài đặt Docker Compose

sudo curl -L "<https://github.com/docker/compose/releases/download/v2.20.2/docker-compose-$(uname> -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

## 3. Tạo swap file (giúp VPS 1GB RAM chạy ổn định hơn)

sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

## 4. Upload source code lên VPS

Trên máy local:
scp -r . root@<IP_VPS>:/opt/main_server/

## 5. Cấp quyền thực thi cho các script

cd /opt/main_server
chmod +x setup-vps.sh deploy.sh

## 6. Chạy script setup (tùy chọn, nếu có file setup-vps.sh)

./setup-vps.sh

Sau đó nên reboot VPS:
sudo reboot

## 7. Copy file cấu hình môi trường

cp .env.production .env

## 8. Deploy ứng dụng bằng Docker Compose

cd /opt/main_server
./deploy.sh

Hoặc nếu không có script deploy.sh:
docker-compose up -d --build

## 9. Kiểm tra ứng dụng

Truy cập địa chỉ: http://<IP_VPS>:9456
Kiểm tra logs: docker-compose logs -f app
