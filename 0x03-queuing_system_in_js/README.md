# Redis Installation on Ubuntu

This guide provides step-by-step instructions for installing Redis on an Ubuntu machine.

## Installation Steps

1. **Update Package List:**

sudo apt update
sudo apt upgrade

2. **Install Redis:**
sudo apt install redis-server

3. **Start Redis:**
sudo systemctl start redis-server

4. **Enable Start on Boot:**
sudo systemctl enable redis-server

5. **Testing Redis:**
redis-cli ping
