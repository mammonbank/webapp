var CONFIG = {
    BASE_API_URL :
        window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://api-mammonbank.com',
    BASE_BANK_URL :
        window.location.hostname === 'localhost' ? 'http://localhost:3002' : 'https://178.62.142.246'
};

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
    GET_CREDIT_CATS: CONFIG.BASE_API_URL + '/api/credit/categories?offset=${offset}&limit=${limit}',
    GET_CREDIT_TYPES: CONFIG.BASE_API_URL + '/api/credit/types?offset=${offset}&limit=${limit}',
    GET_DEPOSIT_TYPES: CONFIG.BASE_API_URL + '/api/deposit/types?offset=${offset}&limit=${limit}',
    GET_CLIENTS: CONFIG.BASE_API_URL + '/api/clients',
    GET_OPERATORS: CONFIG.BASE_API_URL + '/api/bank/employees',
    GET_CREDIT_APP_BY_ID: CONFIG.BASE_API_URL + '/api/credit/applications/${creditAppId}',
    GET_DEPOSIT_APP_BY_ID: CONFIG.BASE_API_URL + '/api/deposit/applications/${depositAppId}',
    GET_CREDITS: CONFIG.BASE_API_URL + '/api/credits',
    GET_DEPOSITS: CONFIG.BASE_API_URL + '/api/deposits',
    GET_CLIENT_BY_ID: CONFIG.BASE_API_URL + '/api/clients/${clientId}',
    GET_CREDIT_APP_ARCHIVES: CONFIG.BASE_API_URL + '/api/credit/applications/archives?offset=${offset}&limit=${limit}',
    GET_DEPOSIT_APP_ARCHIVES: CONFIG.BASE_API_URL + '/api/deposit/applications/archives?offset=${offset}&limit=${limit}',
    GET_CREDIT_ARCHIVES: CONFIG.BASE_API_URL + '/api/credits/archives?offset=${offset}&limit=${limit}',
    GET_DEPOSIT_ARCHIVES: CONFIG.BASE_API_URL + '/api/deposits/archives?offset=${offset}&limit=${limit}',

    GET_CLIENT_ACCOUNT: CONFIG.BASE_API_URL + '/api/client/accounts/${clientId}',
    GET_CLIENT_CREDIT_APPS: CONFIG.BASE_API_URL + '/api/client/${clientId}/credit/applications?offset=${offset}&limit=${limit}',
    GET_CLIENT_CREDIT_ARCHIVES_APPS: CONFIG.BASE_API_URL + '/api/client/${clientId}/archives/credit/applications?offset=${offset}&limit=${limit}',
    GET_CLIENT_DEPOSIT_APPS: CONFIG.BASE_API_URL + '/api/client/${clientId}/deposit/applications?offset=${offset}&limit=${limit}',
    GET_CLIENT_DEPOSIT_ARCHIVES_APPS: CONFIG.BASE_API_URL + '/api/client/${clientId}/archives/deposit/applications?offset=${offset}&limit=${limit}',
    GET_CLIENT_CREDITS: CONFIG.BASE_API_URL + '/api/client/${clientId}/credits/?offset=${offset}&limit=${limit}',
    GET_CLIENT_CREDIT_ARCHIVES: CONFIG.BASE_API_URL + '/api/client/${clientId}/archives/credits?offset=${offset}&limit=${limit}',
    GET_CLIENT_DEPOSITS: CONFIG.BASE_API_URL + '/api/client/${clientId}/deposits/?offset=${offset}&limit=${limit}',
    GET_CLIENT_DEPOSITS_ARCHIVES: CONFIG.BASE_API_URL + '/api/client/${clientId}/archives/deposits/?offset=${offset}&limit=${limit}',

    SEARCH_CLIENTS: CONFIG.BASE_API_URL + '/api/search/clients?q=${searchQuery}',

    GET_CLIENT_SCORING_SERVICE_RESULT: 'http://mammonwebapi.azurewebsites.net/scoringsystem/getscores?clientId=${clientId}',
    GET_CLIENT_SCORING_SERVICE_ANSWERS: 'http://mammonwebapi.azurewebsites.net/scoringsystem/answers?clientId=${clientId}'
};
