var CONFIG = {
    BASE_API_URL :
        window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://api-mammonbank.com',
    BASE_BANK_URL :
        window.location.hostname === 'localhost' ? 'http://localhost:3002' : 'https://178.62.142.246'
}

var URLS = {
    BANK_LOGIN: CONFIG.BASE_API_URL + '/auth/bank',
    BANK_DASHBOARD: CONFIG.BASE_BANK_URL + '/dashboard',
    GET_BANK_INFO: CONFIG.BASE_API_URL + '/api/bank/info',
    GET_BANK_EMPLOYEE: CONFIG.BASE_API_URL + '/api/bank/employees/${bankEmployeeId}',
    GET_BANK_EMPLOYEES: CONFIG.BASE_API_URL + '/api/bank/employees',
    GET_BANK_EMPLOYEE_CREDIT_APPS: CONFIG.BASE_API_URL + '/api/bank/employee/${bankEmployeeId}/credit/applications',
    GET_BANK_EMPLOYEE_DEPOSIT_APPS: CONFIG.BASE_API_URL + '/api/bank/employee/${bankEmployeeId}/deposit/applications',
    GET_CREDIT_APPS: CONFIG.BASE_API_URL + '/api/credit/applications?offset=${offset}&limit=${limit}',
    GET_DEPOSIT_APPS: CONFIG.BASE_API_URL + '/api/deposit/applications?offset=${offset}&limit=${limit}',
    GET_CREDIT_CATS: CONFIG.BASE_API_URL + '/api/credit/categories',
    GET_CREDIT_TYPES: CONFIG.BASE_API_URL + '/api/credit/types',
    GET_DEPOSIT_TYPES: CONFIG.BASE_API_URL + '/api/deposit/types',
    GET_CLIENTS: CONFIG.BASE_API_URL + '/api/clients',
    GET_OPERATORS: CONFIG.BASE_API_URL + '/api/bank/employees',
    GET_CREDIT_APP_BY_ID: CONFIG.BASE_API_URL + '/api/credit/applications/${creditAppId}',
    GET_DEPOSIT_APP_BY_ID: CONFIG.BASE_API_URL + '/api/deposit/applications/${depositAppId}',
    GET_CREDITS: CONFIG.BASE_API_URL + '/api/credits',
    GET_DEPOSITS: CONFIG.BASE_API_URL + '/api/deposits'
};
