#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is not installed. Install Node.js 20 or newer, then run this script again."
  exit 1
fi
if [ ! -d node_modules ]; then
  echo "Installing dependencies..."
  npm install
fi
echo "Building Flâneur..."
npm run build
if command -v open >/dev/null 2>&1; then
  open http://localhost:8787 || true
elif command -v xdg-open >/dev/null 2>&1; then
  xdg-open http://localhost:8787 >/dev/null 2>&1 || true
fi
echo "Starting Flâneur at http://localhost:8787"
npm start
