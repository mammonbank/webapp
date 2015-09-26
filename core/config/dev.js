'use strict';

var config = {};

config.server = {};

config.server.clientPort = process.env.NODE_CLIENT_PORT || 3000;
config.server.adminPort = process.env.NODE_ADMIN_PORT || 3001;

module.exports = config;
