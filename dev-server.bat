@echo off
REM Stux.Digital Clients - local dev server (Windows)
REM Usage: dev-server.bat [port] [--no-dev-mode]
REM   port            default: 8080
REM   --no-dev-mode   don't force DEV_MODE on for this run (see dev-server.js)
setlocal
set "DIR=%~dp0"
node "%DIR%dev-server.js" %*
