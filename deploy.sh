#!/bin/bash

set -e

APP_DIR="/var/www/bitsbuffer-landing-page"
RELEASES_DIR="$APP_DIR/releases"
SHARED_DIR="$APP_DIR/shared"

TIMESTAMP=$(date +%Y%m%d%H%M%S)
RELEASE_DIR="$RELEASES_DIR/$TIMESTAMP"

PREVIOUS_RELEASE=$(readlink -f "$APP_DIR/current" || true)

echo "========================================="
echo "Deploying release: $TIMESTAMP"
echo "========================================="

# Create release directory
mkdir -p "$RELEASE_DIR"

# Extract deployment package (pre-built .next from CI)
echo "Extracting deployment package..."
tar -xzf /tmp/deployment.tar.gz -C "$RELEASE_DIR"

# Runtime env (SMTP, etc.). NEXT_PUBLIC_* must already be baked in at CI build.
echo "Preparing environment..."
cp "$SHARED_DIR/.env.production" "$RELEASE_DIR/.env"

if [ -f "$RELEASE_DIR/.build-info" ]; then
    cat "$RELEASE_DIR/.build-info" >> "$RELEASE_DIR/.env"
fi

# Production dependencies only — app is already built in CI
echo "Installing production dependencies..."
cd "$RELEASE_DIR"

if ! command -v pnpm >/dev/null 2>&1; then
    echo "pnpm not found. Enabling via corepack..."
    corepack enable
    corepack prepare pnpm@9 --activate
fi

pnpm install --prod --frozen-lockfile

# Switch current release
echo "Switching release..."
ln -sfn "$RELEASE_DIR" "$APP_DIR/current"

# Reload PM2
echo "Reloading PM2..."
cd "$APP_DIR/current"
pm2 startOrReload ecosystem.config.js --update-env

# Health check with retries (next start can be slow on first boot)
echo "Waiting for application..."
HTTP_CODE="000"
for i in 1 2 3 4 5 6; do
    sleep 5
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3010/ || true)
    echo "Health check attempt $i: HTTP $HTTP_CODE"
    if [ "$HTTP_CODE" = "200" ]; then
        break
    fi
done

if [ "$HTTP_CODE" = "200" ]; then
    echo "Health check passed."

    rm -f /tmp/deployment.tar.gz /tmp/deploy.sh

    # Keep latest 5 releases
    cd "$RELEASES_DIR"
    ls -dt */ | tail -n +6 | xargs -r rm -rf

    echo "Deployment successful."
    exit 0
fi

echo "Health check FAILED!"

# Rollback
if [ -n "$PREVIOUS_RELEASE" ]; then
    echo "Rolling back..."
    ln -sfn "$PREVIOUS_RELEASE" "$APP_DIR/current"
    cd "$APP_DIR/current"
    pm2 startOrReload ecosystem.config.js --update-env
fi

rm -rf "$RELEASE_DIR"

echo "Rollback completed."
exit 1
