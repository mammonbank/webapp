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
            '       <th>Коэффициент кредитного риска</th>' +
            '       <th>Дата создания</th>' +
            '       <th>Тип кредита</th>' +
            '       <th>Планируемая сумма</th>' +
            '       <th>Планируемый срок (в месяцах)</th>' +
            '       <th>Тип выплаты</th>' +
            '       <th></th>';

        if (DataProvider.getBankEmployee().type === 'OVERSEER') {
            html += '<th>Оператор</th>';
        }

        html += '   </tr>' +
            '</thead><tbody>';

        creditApps.forEach((creditApp) => {
            let creditHistoryCoefficient = DataProvider.getClients()[creditApp.client_id].creditHistoryCoefficient;
            //good client
            if ( creditHistoryCoefficient >= 10 ) {
                html += '<tr class="green">';
            //not sure
            } else if ( 0 <= creditHistoryCoefficient && creditHistoryCoefficient < 10 ) {
                html += '<tr class="yellow">';
            //bad client
            } else {
                html += '<tr class="red">';
            }

            html += '<td class="clientId underscore" data-clientid="' + creditApp.client_id + '">' +
            DataProvider.getClients()[creditApp.client_id].lastName +
            ' ' + DataProvider.getClients()[creditApp.client_id].firstName +
            ' ' + DataProvider.getClients()[creditApp.client_id].patronymic  + '</td>';
            html += '<td>' + creditHistoryCoefficient + '</td>';
            html += '<td>' + moment(creditApp.created_at).format('DD-MM-YYYY') + '</td>';
            html += '<td class="creditTypeId underscore" data-credittypeid="' + creditApp.credit_type_id + '">' +
                DataProvider.getCreditTypes()[creditApp.credit_type_id].title + '</td>';
            html += '<td>' + creditApp.plannedSum + ' BYR</td>';
            html += '<td>' + creditApp.plannedTerm + '</td>';
            html += '<td>' + (creditApp.repaymentType === 'EQUAL' ? 'Аннуитетный' : 'Дифференцированный') + '</td>';

            html += '<td><a data-creditappid="' + creditApp.id + '" data-sum="' + creditApp.plannedSum +
            '"  data-repaymenttype="' + creditApp.repaymentType + '" data-term="' +
            creditApp.plannedTerm + '" data-credittypeid="' + creditApp.credit_type_id +
            '" data-clientid="' + creditApp.client_id +
            '" class="acceptcreditapp-button decision-button">Принять</a> / ' +
                '<a data-creditappid="' + creditApp.id +
            '" class="declinecreditapp-button decision-button">Отклонить</a></td>';

            if (DataProvider.getBankEmployee().type === 'OVERSEER') {
                html += '<td class="operatorId underscore" data-operatorid="' + creditApp.bank_employee_id + '">' +
                DataProvider.getOperators()[creditApp.bank_employee_id].username + '</td>';
            }

            html += '</tr>';
        });

        html += '</tbody></table></div>';

        $('main').append(html);
    }

    static renderDepositApps(depositApps) {
        let html = '<div class="infoWrapper">' +
            '<span class="totalCount">Всего: ' + depositApps.length + '</span>' +
            '<table class="infoTable">' +
            '<thead>' +
            '   <tr><th>Клиент</th>' +
            '       <th>Дата создания</th>' +
            '       <th>Тип вклада</th>' +
            '       <th>Сумма вклада</th>' +
            '       <th></th>';

        if (DataProvider.getBankEmployee().type === 'OVERSEER') {
            html += '<th>Оператор</th>';
        }

        html += '   </tr>' +
        '</thead><tbody>';

        depositApps.forEach((depositApp) => {
            html += '<tr>';

            html += '<td class="clientId underscore" data-clientid="' + depositApp.client_id + '">' +
            DataProvider.getClients()[depositApp.client_id].lastName +
            ' ' + DataProvider.getClients()[depositApp.client_id].firstName +
            ' ' + DataProvider.getClients()[depositApp.client_id].patronymic  + '</td>';
            html += '<td>' + moment(depositApp.created_at).format('DD-MM-YYYY') + '</td>';
            html += '<td class="creditTypeId underscore" data-credittypeid="' + depositApp.deposit_type_id + '">' +
            DataProvider.getDepositTypes()[depositApp.deposit_type_id].title + '</td>';
            html += '<td>' + depositApp.plannedSum + ' BYR</td>';

            html += '<td><a data-depositappid="' + depositApp.id + '" data-sum="' + depositApp.plannedSum +
            '" data-deposittypeid="' + depositApp.deposit_type_id +
            '" data-clientid="' + depositApp.client_id +
            '" class="acceptdepositapp-button decision-button">Принять</a> / ' +
            '<a data-depositappid="' + depositApp.id +
            '" class="declinedepositapp-button decision-button">Отклонить</a></td>';

            if (DataProvider.getBankEmployee().type === 'OVERSEER') {
                html += '<td class="operatorId underscore" data-operatorid="' + depositApp.bank_employee_id + '">' +
                DataProvider.getOperators()[depositApp.bank_employee_id].username + '</td>';
            }

            html += '</tr>';
        });

        html += '</tbody></table></div>';

        $('main').append(html);
    }
}