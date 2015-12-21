class Dashboard {
    static init() {
        DataProvider.getLaunchData()
        .then(( bankEmployee, creditApps, depositApps ) => {
            $('.loader').hide();
            alertify.success("Данные загружены");

            $('main').append('<p>' + bankEmployee[0].username + '</p>');
            Viewer.renderCreditApps(creditApps[0].creditApps);
        })
        .fail((error) => {
            console.error(error.message);
            alertify.error("Ошибка");
        });
    }
}

$(() => {
    Dashboard.init();
});