class Dashboard {
    static init() {
        this.bindEvents();

        DataProvider.getLaunchData()
        .then(( bankEmployee, creditCats, creditTypes, depositTypes, clients ) => {
            $('.overlay').hide();
            $('.loader').hide();
            alertify.success("Данные загружены");

            DataProvider.saveLaunchData(bankEmployee[0],
                creditCats[0].creditCats,
                creditTypes[0].creditTypes,
                depositTypes[0].depositTypes,
                clients[0].clients
            );

            Viewer.renderWelcomeMsg(bankEmployee[0]);
        })
        .then(() => {
            if (DataProvider.getBankEmployee().type === 'OVERSEER') {
                Viewer.renderAside();
                return DataProvider.getBankInfo();
            }
        })
        .then((bankInfo) => {
            if (!bankInfo) {
                Viewer.renderInitialForOperator();
                return;
            }

            DataProvider.setLocalBankInfo(bankInfo);
            Viewer.renderInitialForOverseer();
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
        Eventer.bindAsideEvents();
    }
}

$(() => {
    Dashboard.init();
});