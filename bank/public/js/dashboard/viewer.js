class Viewer {
    static renderWelcomeMsg(bankEmployee) {
        $('#welcome-msg').html('Добро пожаловать, ' + bankEmployee.username);
    }

    static renderCreditApps(creditApps) {
        //var html = '<ul>';
        //creditApps.forEach((creditApp) => {
        //    html += '<li>' + creditApp.plannedSum + '</li>';
        //});
        //html += '</ul>';
        //
        //$('main').append(html);
    }
}