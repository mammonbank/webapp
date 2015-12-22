class DataProvider {
    static getBankEmployeeId() {
        return localStorage.getItem('id');
    }

    static getToken() {
        return localStorage.getItem('token');
    }

    static getLaunchData() {
        return $.when(
            $.ajax({
                url: URLS.GET_BANK_EMPLOYEE.replace('${bankEmployeeId}', this.getBankEmployeeId()),
                method: 'GET',
                headers: { 'Authorization': this.getToken() }
            }),
            $.ajax({
                url: URLS.GET_BANK_EMPLOYEE_CREDIT_APPS.replace('${bankEmployeeId}', this.getBankEmployeeId()),
                method: 'GET',
                headers: { 'Authorization': this.getToken() }
            }),
            $.ajax({
                url: URLS.GET_BANK_EMPLOYEE_DEPOSIT_APPS.replace('${bankEmployeeId}', this.getBankEmployeeId()),
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
}