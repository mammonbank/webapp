class Eventer {
    static bindHeaderEvents() {
        $('#welcome-msg').on('click', () => {
            if (DataProvider.getBankEmployee().type === 'OVERSEER') {
                DataProvider.getBankInfo()
                .then((bankInfo) => {
                    DataProvider.setLocalBankInfo(bankInfo);
                    Viewer.renderInitialForOverseer();
                })
                .fail(() => {
                    alertify.error("Ошибка");
                })
            } else {
                Viewer.renderInitialForOperator();
            }
        });

        $('#logout-btn').on('click', () => {
            localStorage.removeItem('id');
            localStorage.removeItem('token');
            window.location.replace('/');
        });

        let $currentTimeEl = $('#currentTime');
        let currentTime = moment().format('dddd, MMMM Do YYYY, HH:mm:ss');
        $currentTimeEl.html(currentTime);
        setInterval(() => {
            currentTime = moment().format('dddd, MMMM Do YYYY, HH:mm:ss');
            $currentTimeEl.html(currentTime);
        }, 1000)
    }

    static bindAsideEvents() {
        $('#creditApps').on('click', () => {
            $('main').empty();
            $('.loader').show();
            DataProvider.getCreditApps(0, 1111)
            .then((data) => {
                $('.loader').hide();
                alertify.success("Данные загружены");
                Viewer.renderCreditApps(data.creditApps);
            })
            .fail(() => {
                $('.loader').hide();
                alertify.error("Ошибка");
            })
        });

    }

    static bindCreditAppsTabEvents() {
        $('main').on('click', '.acceptcreditapp-button', function() {
            let isSure = confirm('Вы уверены?');
            if (!isSure) {
                return;
            }

            $('.loader').show();
            $('.overlay').show();

            DataManipulator.acceptCreditApp({
                creditAppId: $(this).data('creditappid'),
                sum: +$(this).data('sum'),
                repaymentType: $(this).data('repaymenttype'),
                term: $(this).data('term'),
                creditTypeId: $(this).data('credittypeid'),
                clientId: $(this).data('clientid')
            })
            .then(() => {
                return DataProvider.getCreditApps(0, 1111);
            })
            .then((data) => {
                $('main').empty();
                Viewer.renderCreditApps(data.creditApps);
                $('.loader').hide();
                $('.overlay').hide();
                alertify.success('Кредит успешно создан');
            })
            .fail(() => {
                $('.loader').hide();
                $('.overlay').hide();
                alertify.error('Ошибка');
            });
        });

        $('main').on('click', '.declinecreditapp-button', function() {
            let isSure = confirm('Вы уверены?');
            if (!isSure) {
                return;
            }

            $('.loader').show();
            $('.overlay').show();

            DataManipulator.declineCreditApp({
                creditAppId: $(this).data('creditappid')
            })
            .then(() => {
                return DataProvider.getCreditApps(0, 1111);
            })
            .then((data) => {
                $('main').empty();
                Viewer.renderCreditApps(data.creditApps);
                $('.loader').hide();
                $('.overlay').hide();
                alertify.log('Заявка на кредит отменена');
            })
            .fail(() => {
                $('.loader').hide();
                $('.overlay').hide();
                alertify.error('Ошибка');
            });
        });
    }
}