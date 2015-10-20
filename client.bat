@echo off
echo.

set NODE_PATH=core
set NODE_ENV=development
set DEBUG=mammonbank:client

echo Environment variables are successfully added.
echo. 

node client/bin/www
