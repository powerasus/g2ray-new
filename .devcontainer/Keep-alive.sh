#!/bin/sh

echo "🔄 Keep Alive Service Started - $(date)" > /var/log/keepalive.log

while true; do
    TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[$TIMESTAMP] Keep Alive ping sent" | tee -a /var/log/keepalive.log

    # پینگ به Xray
    curl -s -o /dev/null -w "%{http_code}" https://127.0.0.1:443 --insecure || true

    # پینگ به دامنه ثابت
    curl -s -o /dev/null -w "%{http_code}" "https://effective-halibut-6pvqwxwg9625j9v.github.dev" || true

    sleep 180
done