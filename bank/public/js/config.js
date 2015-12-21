var CONFIG = {
    BASE_API_URL :
        window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://api-mammonbank.com',
    BASE_BANK_URL :
        window.location.hostname === 'localhost' ? 'http://localhost:3002' : 'https://178.62.142.246',
    HTTP_METHOD : {
        GET: 'GET',
        POST: 'POST',
        PATCH: 'PATCH',
        DELETE: 'DELETE'
    }
}

var URLS = {
    BANK_LOGIN: {
        URL: CONFIG.BASE_API_URL + '/auth/bank',
        METHOD: CONFIG.HTTP_METHOD.POST
    },
    BANK_DASHBOARD: {
        URL: CONFIG.BASE_BANK_URL + '/dashboard',
        METHOD: CONFIG.HTTP_METHOD.GET
    }
};
