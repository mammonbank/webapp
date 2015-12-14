var CONFIG = {
    BASE_API_URL :
        window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://api-mammonbank.com',
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
    }
};
