'use strict';

var config = {};

config.server = {};

config.server.clientPort = process.env.NODE_CLIENT_PORT || 3000;
config.server.adminPort = process.env.NODE_ADMIN_PORT || 3001;

config.db = {};

config.db.dbname = process.env.NODE_DB_NAME || 'mammonbank';
config.db.username = process.env.NODE_DB_USERNAME || 'wiranoid';
config.db.password = process.env.NODE_DB_PASSWORD || 'nevergiveup';
config.db.host = process.env.NODE_DB_HOST || 'localhost';
config.db.dialect = process.env.NODE_DB_DIALECT || 'postgres';

config.db.pool = {};

config.db.pool.max = process.env.NODE_DB_POOL_MAX || 10;
config.db.pool.min = process.env.NODE_DB_POOL_MIN || 1;
config.db.pool.idle = process.env.NODE_DB_POOL_IDLE || 10000;

module.exports = config;
