class Viewer {
    static renderWelcomeMsg(bankEmployee) {
        $('#welcome-msg').html('Добро пожаловать, ' + bankEmployee.username);
    }

    static renderAside() {
        $('#activitiesList').append('<li id="aside_operators">' + 'Операторы' + '</li>');
    }

    static renderBankInfo(bankInfo) {
        $('#baseMoney').html(bankInfo.baseMoney + ' BYR');
        $('#moneySupply').html(bankInfo.moneySupply + ' BYR');
        $('#reserveRatio').html(bankInfo.reserveRatio * 100 + ' %');
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