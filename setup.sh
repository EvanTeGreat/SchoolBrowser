#!/bin/bash

info() {
  echo -e "\033[1;34m$1\033[0m"
}

success() {
  echo -e "\033[1;32m$1\033[0m"
}

error() {
  echo -e "\033[1;31m$1\033[0m"
}

separator() {
  echo -e "\033[1;37m---------------------------------------------\033[0m"
}

time_command() {
  local START_TIME=$(date +%s.%N)
  eval "$1"
  local END_TIME=$(date +%s.%N)
  local DURATION=$(echo "$END_TIME - $START_TIME" | bc)
  echo -e "\033[1;33m${DURATION} seconds\033[0m"
  echo -e "Done!"
}

clear

separator
info "Starting the setup process..."
separator

info "Step 1: Updating package lists..."
time_command "sudo apt update -y > /dev/null 2>&1"
separator

info "Step 2: Installing Node.js, npm, and Certbot..."
time_command "sudo apt install -y nodejs npm certbot python3-certbot-nginx > /dev/null 2>&1"
separator

info "Step 3: Installing Express..."
time_command "npm install express > /dev/null 2>&1"
separator

info "Step 4: Please enter your subdomain (e.g., subdomain.example.com):"
read -p "Subdomain: " SUBDOMAIN

if [ -z "$SUBDOMAIN" ]; then
  error "No subdomain entered. Exiting."
  separator
  exit 1
fi

info "Step 5: Requesting SSL certificate for $SUBDOMAIN..."
sudo certbot --nginx -d "$SUBDOMAIN"
separator

success "SSL configuration complete for $SUBDOMAIN!"
separator

info "Step 6: Running conf.sh..."
time_command "sudo bash /var/www/oav/conf.sh"
separator

info "Step 7: Installing PM2..."
time_command "sudo npm install pm2 -g > /dev/null 2>&1"
separator

info "Step 8: Starting the application with PM2..."
time_command "pm2 start /var/www/oav/index.mjs"
separator

info "Step 9: Saving PM2 process list..."
time_command "pm2 save > /dev/null 2>&1"
separator

info "Step 10: Configuring PM2 to start on boot..."
time_command "pm2 startup > /dev/null 2>&1"
separator

info "Step 11: Running updates.sh..."
time_command "sudo nohup bash /var/www/oav/updates.sh &> /var/www/oav/updates.log &"
separator

success "🎉 Congratulations! Your setup is complete, and your domain is now live with Ulrua! 🎉 You can now safely close this terminal."
separator