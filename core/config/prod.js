'use strict';

var env = process.env;

module.exports = {
    server: {
        clientPort: env.NODE_CLIENT_PORT || 3001,
        bankPort: env.NODE_BANK_PORT || 3002,
        apiPort: env.NODE_API_PORT || 3000
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
    security: {
        saltWorkFactor: 10,
        tokenSecret: 'War is peace. Freedom is slavery. Ignorance is strength.',
        tokenExpirationTime: '6h'
    }
};
