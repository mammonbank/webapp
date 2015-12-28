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
            'http://178.62.142.246',
            'http://api-mammonbank.com'
        ]
    },
    db: {
        dbname: env.NODE_DB_NAME || 'mammonbank',
        username: env.NODE_DB_USERNAME,
        password: env.NODE_DB_PASSWORD,
        host: env.NODE_DB_HOST || 'localhost',
        port: env.NODE_DB_PORT || 5432,
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
            creditor: '00 00 00 1 * *',
            debtor: '00 00 00 15 * *'
        }
    },
    testcron: {
        times: {
            creditor: '0,30 * * * * *',
            debtor: '15,45 * * * * *'
        }
    },
    external: {
        clientScoringServiceLink: 'http://mammonwebapi.azurewebsites.net/?clientLink='
    }
};
