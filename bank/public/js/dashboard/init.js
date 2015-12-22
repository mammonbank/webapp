var _bankEmployee;

class Dashboard {
    static getBankEmployee() {
        return _bankEmployee;
    };

    static setBankEmployee(bankEmployee) {
        _bankEmployee = bankEmployee;
    }

    static init() {
        this.bindEvents();

        DataProvider.getLaunchData()
        .then(( bankEmployee, creditApps, depositApps ) => {
            $('.overlay').hide();
            $('.loader').hide();
            alertify.success("Данные загружены");

            this.setBankEmployee(bankEmployee[0]);

            Viewer.renderWelcomeMsg(this.getBankEmployee());
            Viewer.renderCreditApps(creditApps[0].creditApps);
        })
        .then(() => {
            if (this.getBankEmployee().type === 'OVERSEER') {
                Viewer.renderAside();
                return DataProvider.getBankInfo();
            }
        })
        .then((bankInfo) => {
            if (!bankInfo) {
                $('.bankInfo').remove();
                return;
            }

            Viewer.renderBankInfo(bankInfo);
        })
        .fail(() => {
            $('.loader').hide();
            alertify.error("Ошибка авторизации");
            setTimeout(() => {
                alertify.log("Выход...");
            }, 500);
            setTimeout(() => {
                window.location.replace('/');
            }, 1000);
        });
    }

    static bindEvents() {
        Eventer.bindHeaderEvents();
    }
}

$(() => {
    Dashboard.init();
});