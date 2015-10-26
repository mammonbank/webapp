'use strict';

var env = process.env;

module.exports = {
	server: {
		clientPort: env.NODE_CLIENT_PORT || 3000,
		adminPort: env.NODE_ADMIN_PORT || 3001
	},
	db: {
		dbname: env.NODE_DB_NAME || 'mammonbank',
		username: env.NODE_DB_USERNAME,
		password: env.NODE_DB_PASSWORD,
		host: env.NODE_DB_HOST || 'localhost',
		dialect: env.NODE_DB_DIALECT || 'postgres',
		pool: {
			max: env.NODE_DB_POOL_MAX || 10,
			min: env.NODE_DB_POOL_MIN || 1,
			idle: env.NODE_DB_POOL_IDLE || 5000
		}
	},
	authy: {
		apiKey: env.AUTHY_API_KEY
	},
    saltWorkFactor: 10
};
