#!/bin/bash
# Stux.Digital Clients - local dev server
# Usage: ./dev-server.sh [port] [--no-dev-mode]
#   port            default: 8080
#   --no-dev-mode   don't force DEV_MODE on for this run (see dev-server.js)
set -e
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
exec node "$DIR/dev-server.js" "$@"
