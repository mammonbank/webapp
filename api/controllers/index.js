'use strict';

var express = require('express'),
    router = express.Router();

router.use('/api/bank/info', require('./bankInfo'));

router.use('/api/client/accounts', require('./clientAccounts'));
router.use('/api/client', require('./clientAssets'));

router.use('/api/clients', require('./clients'));

router.use('/auth/client', require('./clientAuth'));

router.use('/api/credit/applications', require('./creditApplications'));
router.use('/api/credit/categories', require('./creditCategories'));
router.use('/api/credit/types', require('./creditTypes'));
router.use('/api/credits', require('./credits'));

router.use('/api/deposit/applications', require('./depositApplications'));
router.use('/api/deposit/types', require('./depositTypes'));
router.use('/api/deposits', require('./deposits'));

router.use('/auth/bank', require('./bankAuth'));
router.use('/api/bank/employees', require('./bankEmployees'));

router.use('/api/bank/employee', require('./bankEmployeeAssets'));

router.use('/api/search', require('./search.js'));

router.get('/', function(req, res) {
    res.json({
        message: 'Welcome to the mammonbank api server'
    });
});

module.exports = router;
