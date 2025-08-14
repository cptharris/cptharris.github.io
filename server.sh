#!/usr/bin/env zsh

# Script Purpose:
# This script sets up a local development environment for cptharris.github.io by:
# 1. Temporarily adding a hosts entry to map cptharris.github.io to localhost.
# 2. Starting a custom HTTP server to serve local content.
# 3. Running Caddy as a reverse proxy with HTTPS support.
# The script ensures cleanup on exit, restoring system state.

HOST_ENTRY='127.0.0.1 cptharris.github.io'
HOSTS_MODIFIED=false
SERVER_PID=""

# 🧹 Cleanup function:
# - Kills the background server if running.
# - Removes the temporary hosts entry to avoid lingering changes.
# - Deletes any .DS_Store files in the directory for cleanliness.
# This function is triggered on script exit or interruption (INT, TERM).
cleanup() {
  echo "🧹 Cleaning up..."
  if [ -n "${SERVER_PID:-}" ] && kill -0 "$SERVER_PID" 2>/dev/null; then
    echo "Killing python (PID $SERVER_PID)"
    kill "$SERVER_PID" 2>/dev/null || true
    wait "$SERVER_PID" 2>/dev/null || true
  fi
  if [ "$HOSTS_MODIFIED" = true ]; then
    echo "Removing host entry from /etc/hosts"
    # Use sudo to safely remove the temporary hosts entry added earlier.
    sudo sed -i.bak '/127\.0\.0\.1 cptharris\.github\.io/d' /etc/hosts || true
  fi
  find . -name .DS_Store -delete || true
}
trap cleanup EXIT INT TERM

# 📝 Modify /etc/hosts:
# Temporarily add an entry mapping cptharris.github.io to localhost (127.0.0.1).
# This allows local requests to resolve correctly during development.
# The entry is removed on script exit to avoid permanent system changes.
if ! grep -qF "$HOST_ENTRY" /etc/hosts; then
  echo "📝 Adding host entry to /etc/hosts"
  echo "$HOST_ENTRY" | sudo tee -a /etc/hosts > /dev/null
  HOSTS_MODIFIED=true
fi

# ⚙️ Ensure Caddy is installed:
# Caddy is used as a local HTTPS reverse proxy.
# If missing, instruct the user to install it via Homebrew.
if ! command -v caddy >/dev/null 2>&1; then
  echo "⚠️ Caddy is not installed. Install it with: brew install caddy"
  exit 1
fi

# 🔐 Caddy trust setup (commented out):
# This command trusts Caddy's local CA for HTTPS certificates.
# It's commented out because it may prompt for sudo and is not always necessary.
# Uncomment if you want to ensure Caddy's CA is trusted on your system.
# echo "🔐 Ensuring Caddy trust (may prompt for sudo)..."
# sudo caddy trust || echo "caddy trust failed or already trusted — continuing."

# 🚀 Start HTTP server in background:
# Runs a custom server bound to localhost:8000.
# This server serves local files and runs in the background to allow Caddy to run concurrently.
# python3 ../thoughtful-http.server.py 8000 --bind 127.0.0.1 & # old server
node server.js &
SERVER_PID=$!
echo "🚀 HTTP server started (PID $SERVER_PID)"

# 🧺 Start Caddy in foreground:
# Runs Caddy with the specified config file to provide HTTPS and reverse proxying.
# Running in foreground allows easy termination with Ctrl+C and ensures cleanup triggers.
echo "🧺 Starting Caddy (use Ctrl+C to stop)..."
caddy run --config ./CaddyFile

# When Caddy exits, the cleanup function runs automatically via the EXIT trap.
exit 0