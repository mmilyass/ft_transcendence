#!/bin/sh

set -e

CERT_DIR="/etc/nginx/certs"

apk update && apk add --no-cache openssl openssl-dev

mkdir -p "$CERT_DIR"

if [ ! -f "$CERT_DIR/server.crt" ] || [ ! -f "$CERT_DIR/server.key" ]; then
    echo "Generating self-signed certificate..."

    openssl req -x509 -nodes -days 365 \
        -newkey rsa:2048 \
        -keyout "$CERT_DIR/server.key" \
        -out "$CERT_DIR/server.crt" \
        -subj "/C=MA/ST=Souss-Massa/L=Agadir/O=42/CN=ft_transcendence"
fi

sed "s|__HTTPS_REDIRECT_PORT__|${HTTPS_REDIRECT_PORT:-}|g" \
    /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf

echo "Starting nginx..."

exec nginx -g "daemon off;"