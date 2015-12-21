var CONFIG = {
    BASE_API_URL :
        window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://api-mammonbank.com',
    BASE_BANK_URL :
        window.location.hostname === 'localhost' ? 'http://localhost:3002' : 'https://178.62.142.246'
}

var URLS = {
    BANK_LOGIN: CONFIG.BASE_API_URL + '/auth/bank',
    BANK_DASHBOARD: CONFIG.BASE_BANK_URL + '/dashboard',
    GET_BANK_EMPLOYEE: CONFIG.BASE_API_URL + '/api/bank/employees/${bankEmployeeId}',
    GET_BANK_EMPLOYEES: CONFIG.BASE_API_URL + '/api/bank/employees',
    GET_BANK_EMPLOYEE_CREDIT_APPS: CONFIG.BASE_API_URL + '/api/bank/employee/${bankEmployeeId}/credit/applications',
    GET_BANK_EMPLOYEE_DEPOSIT_APPS: CONFIG.BASE_API_URL + '/api/bank/employee/${bankEmployeeId}/deposit/applications'
};
