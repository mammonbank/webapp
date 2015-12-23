class Eventer {
    static bindHeaderEvents() {
        $('#welcome-msg').on('click', () => {
            if (DataProvider.getBankEmployee().type === 'OVERSEER') {
                Viewer.renderInitialForOverseer();
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
                alertify.error("Ошибка");
            })
        });

    }
}