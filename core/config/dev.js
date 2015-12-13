'use strict';

var env = process.env;

module.exports = {
    server: {
        apiPort: env.NODE_API_PORT || 3000,
        clientPort: env.NODE_CLIENT_PORT || 3001,
        bankPort: env.NODE_BANK_PORT || 3002,
        allowedOrigins: [
            'http://localhost:3000',
            'http://localhost:3001',
            'http://localhost:3002',
            'http://mammonbank.tk',
            'http://admin-mammonbank.tk',
            'http://api-mammonbank.com'
        ]
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
    bank: {
        baseMoney: 100000000,
        moneySupply: 900000000,
        reserveRatio: 0.1,
        credits: {
            overduePercent: 0.05
        }
    },
    security: {
        saltWorkFactor: 10,
        tokenSecret: 'War is peace. Freedom is slavery. Ignorance is strength.',
        tokenExpirationTime: '6h'
    },
    cron: {
        isEnabled: true,
        times: {
            creditor: '*/10 * * * * *',
            debtor: '*/10 * * * * *'
        }
    },
    testcron: {
        times: {
            creditor: '0,10,20,30,40,50 * * * * *',
            debtor: '5,15,25,35,45,55 * * * * *'
        }
    }
};
