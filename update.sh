#!/bin/bash
sudo git pull && npm install && sudo chown www-data:www-data * && pm2 restart server