@echo off
echo.

set NODE_PATH=core
set NODE_ENV=development
set DEBUG=mammonbank:admin

echo Environment variables are successfully added.
echo. 

node admin/app.js
