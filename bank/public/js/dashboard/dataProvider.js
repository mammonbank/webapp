var _bankEmployee,
    _bankInfo = {},
    _creditCats = {},
    _creditTypes = {},
    _depositTypes = {},
    _clients = {},
    _operators = {};

class DataProvider {
    static getBankEmployeeId() {
        return localStorage.getItem('id');
    }

    static getToken() {
        return localStorage.getItem('token');
    }

    static setBankEmployeeType(type) {
        localStorage.setItem('type', type.toLowerCase());
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
                url: URLS.GET_CREDIT_CATS,
                method: 'GET'
            }),
            $.ajax({
                url: URLS.GET_CREDIT_TYPES,
                method: 'GET'
            }),
            $.ajax({
                url: URLS.GET_DEPOSIT_TYPES,
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

        if (bankEmployeeType === 'operator') {
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

        if (bankEmployeeType === 'operator') {
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
}