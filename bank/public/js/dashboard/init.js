class Dashboard {
    static init() {
        this.bindEvents();

        DataProvider.getLaunchData()
        .then(( bankEmployee, creditApps, depositApps ) => {
            $('.loader').hide();
            alertify.success("Данные загружены");

            Viewer.renderWelcomeMsg(bankEmployee[0]);
            Viewer.renderCreditApps(creditApps[0].creditApps);
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