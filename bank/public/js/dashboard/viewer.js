class Viewer {
    static renderInitialForOverseer() {
        $('main').html('<table class="bankInfo">' +
        '<thead>' +
        '<tr><th>Денежная база</th><th>Денежная масса</th><th>Коэффициент резервирования</th></tr>' +
        '</thead>' +
        '<tbody>' +
        '<tr><td id="baseMoney"></td><td id="moneySupply"></td><td id="reserveRatio"></td></tr>' +
        '</tbody>' +
        '</table>');
        this.renderBankInfo(DataProvider.getLocalBankInfo());
    }

    static renderInitialForOperator() {
        $('main').html('Йоу');
    }

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
        let html = '<div class="infoWrapper">' +
            '<span class="totalCount">Всего: ' + creditApps.length + '</span>' +
            '<table class="infoTable">' +
            '<thead>' +
            '   <tr><th>Клиент</th>' +
            '       <th>Дата создания</th>' +
            '       <th>Тип кредита</th>' +
            '       <th>Планируемая сумма</th>' +
            '       <th>Планируемый срок (в месяцах)</th>' +
            '       <th>Тип выплаты</th>' +
            '   </tr>' +
            '</thead><tbody>';

        creditApps.forEach((creditApp) => {
            html += '<tr>';
            html += '<td>' + DataProvider.getClients()[creditApp.client_id].lastName +
            ' ' + DataProvider.getClients()[creditApp.client_id].firstName +
            ' ' + DataProvider.getClients()[creditApp.client_id].patronymic  + '</td>';
            html += '<td>' + moment(creditApp.created_at).format('DD-MM-YYYY') + '</td>';
            html += '<td>' + DataProvider.getCreditTypes()[creditApp.credit_type_id].title + '</td>';
            html += '<td>' + creditApp.plannedSum + ' BYR</td>';
            html += '<td>' + creditApp.plannedTerm + '</td>';
            html += '<td>' + (creditApp.repaymentType === 'EQUAL' ? 'Аннуитетный' : 'Дифференцированный') + '</td>';
            html += '</tr>';
        });

        html += '</tbody></table></div>';

        $('main').append(html);
    }
}