#!/bin/bash
# Stux.Digital Clients - local dev server
# Usage: ./dev-server.sh [port] [--no-dev-mode] [--lan]
#   port            default: 8080
#   --no-dev-mode   don't force DEV_MODE on for this run (see dev-server.js)
#   --lan           listen on all interfaces so phones/tablets on your network can
#                   connect (prints the addresses to open); default is 127.0.0.1 only
set -e
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
exec node "$DIR/dev-server.js" "$@"
