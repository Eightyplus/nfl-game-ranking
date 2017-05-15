#!/bin/bash
sudo git pull && sudo chown www-data:www-data * && pm2 restart server