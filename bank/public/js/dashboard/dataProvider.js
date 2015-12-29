var _bankEmployee,
    _bankInfo = {},
    _creditCats = {},
    _creditTypes = {},
    _depositTypes = {},
    _clients = {},
    _operators = {};

class DataProvider {
    static getBankEmployeeId() {
        return +localStorage.getItem('id');
    }

    static getToken() {
        return localStorage.getItem('token');
    }

    static setBankEmployeeType(type) {
        localStorage.setItem('type', type);
    }

    static getBankEmployeeType() {
        return localStorage.getItem('type');
    }

    static getBankEmployee() {
        return _bankEmployee;
    }

    static setBankEmployee(bankEmployee) {
        _bankEmployee = bankEmployee;
    }

    static getLocalBankInfo() {
        return _bankInfo;
    }

    static setLocalBankInfo(bankInfo) {
        _bankInfo = bankInfo;
    }

    static setCreditCats(creditCats) {
        creditCats.forEach((creditCat) => {
            _creditCats[creditCat.id] = creditCat;
        });
    }

    static getCreditCats() {
        return _creditCats;
    }

    static setCreditTypes(creditTypes) {
        creditTypes.forEach((creditType) => {
            _creditTypes[creditType.id] = creditType;
        });
    }

    static getCreditTypes() {
        return _creditTypes;
    }

    static setDepositTypes(depositTypes) {
        depositTypes.forEach((depositType) => {
            _depositTypes[depositType.id] = depositType;
        });
    }

    static getDepositTypes() {
        return _depositTypes;
    }

    static setClients(clients) {
        clients.forEach((client) => {
            _clients[client.id] = client;
        });
    }

    static getClients() {
        return _clients;
    }

    static setOperators(operators) {
        operators.forEach((operator) => {
            _operators[operator.id] = operator;
        });
    }

    static getOperators() {
        return _operators;
    }

    static getLaunchData() {
        return $.when(
            $.ajax({
                url: URLS.GET_BANK_EMPLOYEE.replace('${bankEmployeeId}', this.getBankEmployeeId()),
                method: 'GET',
                headers: { 'Authorization': this.getToken() }
            }),
            $.ajax({
                url: URLS.GET_CREDIT_CATS.replace('${offset}', 0).replace('${limit}', 50),
                method: 'GET'
            }),
            $.ajax({
                url: URLS.GET_CREDIT_TYPES.replace('${offset}', 0).replace('${limit}', 50),
                method: 'GET'
            }),
            $.ajax({
                url: URLS.GET_DEPOSIT_TYPES.replace('${offset}', 0).replace('${limit}', 50),
                method: 'GET'
            }),
            $.ajax({
                url: URLS.GET_CLIENTS,
                method: 'GET',
                headers: { 'Authorization': this.getToken() }
            })
        );
    }

    static getAdditionalLaunchDataForOverseer() {
        return $.when(
            $.ajax({
                url: URLS.GET_BANK_INFO,
                method: 'GET',
                headers: { 'Authorization': this.getToken() }
            }),
            $.ajax({
                url: URLS.GET_OPERATORS,
                method: 'GET',
                headers: { 'Authorization': this.getToken() }
            })
        );
    }

    static getBankInfo() {
        return $.ajax({
            url: URLS.GET_BANK_INFO,
            method: 'GET',
            headers: { 'Authorization': this.getToken() }
        });
    }

    static saveLaunchData(bankEmployee, creditCats, creditTypes, depositTypes, clients) {
        this.setBankEmployee(bankEmployee);
        this.setBankEmployeeType(bankEmployee.type);
        this.setCreditCats(creditCats);
        this.setCreditTypes(creditTypes);
        this.setDepositTypes(depositTypes);
        this.setClients(clients);
    }

    static getCreditApps(offset, limit) {
        var bankEmployeeType = DataProvider.getBankEmployeeType();

        if (bankEmployeeType === 'OPERATOR') {
            return $.ajax({
                url: URLS.GET_BANK_EMPLOYEE_CREDIT_APPS.replace('${bankEmployeeId}', this.getBankEmployeeId()),
                method: 'GET',
                headers: { 'Authorization': this.getToken() }
            });
        } else {
            return $.ajax({
                url: URLS.GET_CREDIT_APPS.replace('${offset}', offset).replace('${limit}', limit),
                method: 'GET',
                headers: { 'Authorization': this.getToken() }
            });
        }
    }

    static getDepositApps(offset, limit) {
        var bankEmployeeType = DataProvider.getBankEmployeeType();

        if (bankEmployeeType === 'OPERATOR') {
            return $.ajax({
                url: URLS.GET_BANK_EMPLOYEE_DEPOSIT_APPS.replace('${bankEmployeeId}', this.getBankEmployeeId()),
                method: 'GET',
                headers: { 'Authorization': this.getToken() }
            });
        } else {
            return $.ajax({
                url: URLS.GET_DEPOSIT_APPS.replace('${offset}', offset).replace('${limit}', limit),
                method: 'GET',
                headers: { 'Authorization': this.getToken() }
            });
        }
    }

    static getCredits(offset, limit) {
        return $.ajax({
            url: URLS.GET_CREDITS.replace('${offset}', offset).replace('${limit}', limit),
            method: 'GET',
            headers: { 'Authorization': this.getToken() }
        });
    }

    static getDeposits(offset, limit) {
        return $.ajax({
            url: URLS.GET_DEPOSITS.replace('${offset}', offset).replace('${limit}', limit),
            method: 'GET',
            headers: { 'Authorization': this.getToken() }
        });
    }

    static getClientsRemote(offset, limit) {
        return $.ajax({
            url: URLS.GET_CLIENTS.replace('${offset}', offset).replace('${limit}', limit),
            method: 'GET',
            headers: { 'Authorization': this.getToken() }
        });
    }

    static getOperatorsRemote(offset, limit) {
        return $.ajax({
            url: URLS.GET_OPERATORS.replace('${offset}', offset).replace('${limit}', limit),
            method: 'GET',
            headers: { 'Authorization': this.getToken() }
        });
    }

    static getCreditAppArchives(offset, limit) {
        return $.ajax({
            url: URLS.GET_CREDIT_APP_ARCHIVES.replace('${offset}', offset).replace('${limit}', limit),
            method: 'GET',
            headers: { 'Authorization': this.getToken() }
        });
    }

    static getDepositAppArchives(offset, limit) {
        return $.ajax({
            url: URLS.GET_DEPOSIT_APP_ARCHIVES.replace('${offset}', offset).replace('${limit}', limit),
            method: 'GET',
            headers: { 'Authorization': this.getToken() }
        });
    }

    static getCreditArchives(offset, limit) {
        return $.ajax({
            url: URLS.GET_CREDIT_ARCHIVES.replace('${offset}', offset).replace('${limit}', limit),
            method: 'GET',
            headers: { 'Authorization': this.getToken() }
        });
    }

    static getDepositArchives(offset, limit) {
        return $.ajax({
            url: URLS.GET_DEPOSIT_ARCHIVES.replace('${offset}', offset).replace('${limit}', limit),
            method: 'GET',
            headers: { 'Authorization': this.getToken() }
        });
    }

    static getCreditCatsRemote(offset, limit) {
        return $.ajax({
            url: URLS.GET_CREDIT_CATS.replace('${offset}', offset).replace('${limit}', limit),
            method: 'GET'
        });
    }

    static getCreditTypesRemote(offset, limit) {
        return $.ajax({
            url: URLS.GET_CREDIT_TYPES.replace('${offset}', offset).replace('${limit}', limit),
            method: 'GET'
        });
    }

    static getDepositTypesRemote(offset, limit) {
        return $.ajax({
            url: URLS.GET_DEPOSIT_TYPES.replace('${offset}', offset).replace('${limit}', limit),
            method: 'GET'
        });
    }

    static getAllClientInfo(clientId) {
        return $.when(
            $.ajax({
                url: URLS.GET_CLIENT_CREDIT_APPS.replace('${clientId}', clientId).replace('${offset}', 0).replace('${limit}', 1111),
                method: 'GET',
                headers: { 'Authorization': this.getToken() }
            }),
            $.ajax({
                url: URLS.GET_CLIENT_CREDIT_ARCHIVES_APPS.replace('${clientId}', clientId).replace('${offset}', 0).replace('${limit}', 1111),
                method: 'GET',
                headers: { 'Authorization': this.getToken() }
            }),
            $.ajax({
                url: URLS.GET_CLIENT_DEPOSIT_APPS.replace('${clientId}', clientId).replace('${offset}', 0).replace('${limit}', 1111),
                method: 'GET',
                headers: { 'Authorization': this.getToken() }
            }),
            $.ajax({
                url: URLS.GET_CLIENT_DEPOSIT_ARCHIVES_APPS.replace('${clientId}', clientId).replace('${offset}', 0).replace('${limit}', 1111),
                method: 'GET',
                headers: { 'Authorization': this.getToken() }
            }),
            $.ajax({
                url: URLS.GET_CLIENT_CREDITS.replace('${clientId}', clientId).replace('${offset}', 0).replace('${limit}', 1111),
                method: 'GET',
                headers: { 'Authorization': this.getToken() }
            }),
            $.ajax({
                url: URLS.GET_CLIENT_CREDIT_ARCHIVES.replace('${clientId}', clientId).replace('${offset}', 0).replace('${limit}', 1111),
                method: 'GET',
                headers: { 'Authorization': this.getToken() }
            }),
            $.ajax({
                url: URLS.GET_CLIENT_DEPOSITS.replace('${clientId}', clientId).replace('${offset}', 0).replace('${limit}', 1111),
                method: 'GET',
                headers: { 'Authorization': this.getToken() }
            }),
            $.ajax({
                url: URLS.GET_CLIENT_DEPOSITS_ARCHIVES.replace('${clientId}', clientId).replace('${offset}', 0).replace('${limit}', 1111),
                method: 'GET',
                headers: { 'Authorization': this.getToken() }
            }),
            $.ajax({
                url: URLS.GET_CLIENT_ACCOUNT.replace('${clientId}', clientId),
                method: 'GET',
                headers: { 'Authorization': this.getToken() }
            })
        );
    }

    static getClientsRemoteArchives(offset, limit) {
        return $.ajax({
            url: URLS.GET_CLIENTS_ARCHIVES.replace('${offset}', offset).replace('${limit}', limit),
            method: 'GET',
            headers: { 'Authorization': this.getToken() }
        });
    }

    static searchClients(searchQuery) {
        return $.ajax({
            url: URLS.SEARCH_CLIENTS.replace('${searchQuery}', searchQuery),
            method: 'GET',
            headers: { 'Authorization': this.getToken() }
        })
    }

}