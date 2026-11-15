@echo off
REM Stux.Digital Clients - local dev server (Windows)
REM Usage: dev-server.bat [port] [--no-dev-mode] [--lan]
REM   port            default: 8080
REM   --no-dev-mode   don't force DEV_MODE on for this run (see dev-server.js)
REM   --lan           listen on all interfaces so phones/tablets on your network can
REM                   connect (prints the addresses to open); default is 127.0.0.1 only
setlocal
set "DIR=%~dp0"
node "%DIR%dev-server.js" %*
