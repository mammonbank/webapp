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
                html += '<tr>';
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

    static renderCredits(credits) {
        let html = '<div class="infoWrapper">' +
            '<span class="totalCount">Всего: ' + credits.length + '</span>' +
            '<table class="infoTable">' +
            '<thead>' +
            '   <tr><th>Клиент</th>' +
            '       <th>Дата создания</th>' +
            '       <th>Дата окончания</th>' +
            '       <th>Тип кредита</th>' +
            '       <th>Тип выплаты</th>' +
            '       <th>Сумма кредита</th>' +
            '       <th>Остаток по кредиту</th>' +
            '       <th>Кол-во платежей</th>' +
            '       <th>Последняя дата оплаты</th>' +
            '       <th>Задолженность по кредиту</th>';

        html += '   </tr>' +
        '</thead><tbody>';

        credits.forEach((credit) => {
            if ( credit.overdueSum > 0 ) {
                html += '<tr class="red">';
            } else {
                html += '<tr>';
            }

            html += '<td class="clientId underscore" data-clientid="' + credit.client_id + '">' +
            DataProvider.getClients()[credit.client_id].lastName +
            ' ' + DataProvider.getClients()[credit.client_id].firstName +
            ' ' + DataProvider.getClients()[credit.client_id].patronymic  + '</td>';
            html += '<td>' + moment(credit.startDate).format('DD-MM-YYYY') + '</td>';
            html += '<td>' + moment(credit.endDate).format('DD-MM-YYYY') + '</td>';

            html += '<td class="creditTypeId underscore" data-credittypeid="' + credit.credit_type_id + '">' +
            DataProvider.getCreditTypes()[credit.credit_type_id].title + '</td>';
            html += '<td>' + (credit.repaymentType === 'EQUAL' ? 'Аннуитетный' : 'Дифференцированный') + '</td>';
            html += '<td>' + credit.sum + ' BYR</td>';
            html += '<td>' + credit.outstandingLoan + ' BYR</td>';
            html += '<td>' + credit.numberOfPayments + '</td>';
            html += '<td>' + (credit.lastPaymentDate != null ? moment( credit.lastPaymentDate ).format('DD-MM-YYYY') : '')   + '</td>';
            html += '<td>' + credit.overdueSum + ' BYR</td>';

            html += '</tr>';
        });

        html += '</tbody></table></div>';

        $('main').append(html);
    }

    static renderDeposits(deposits) {
        let html = '<div class="infoWrapper">' +
            '<span class="totalCount">Всего: ' + deposits.length + '</span>' +
            '<table class="infoTable">' +
            '<thead>' +
            '   <tr><th>Клиент</th>' +
            '       <th>Дата создания</th>' +
            '       <th>Тип вклада</th>' +
            '       <th>Сумма вклада</th>' +
            '       <th>Последняя дата начисления процентов</th>';

        html += '   </tr>' +
        '</thead><tbody>';

        deposits.forEach((deposit) => {
            html += '<tr>';

            html += '<td class="clientId underscore" data-clientid="' + deposit.client_id + '">' +
            DataProvider.getClients()[deposit.client_id].lastName +
            ' ' + DataProvider.getClients()[deposit.client_id].firstName +
            ' ' + DataProvider.getClients()[deposit.client_id].patronymic  + '</td>';
            html += '<td>' + moment(deposit.startDate).format('DD-MM-YYYY') + '</td>';

            html += '<td class="depositTypeId underscore" data-deposittypeid="' + deposit.deposit_type_id + '">' +
            DataProvider.getDepositTypes()[deposit.deposit_type_id].title + '</td>';
            html += '<td>' + deposit.sum + ' BYR</td>';
            html += '<td>' + (deposit.lastInterestDate != null ? moment( deposit.lastInterestDate ).format('DD-MM-YYYY') : '')   + '</td>';

            html += '</tr>';
        });

        html += '</tbody></table></div>';

        $('main').append(html);
    }

    static renderClients(clients) {
        let html = '<div class="infoWrapper">' +
            '<span class="totalCount">Всего: ' + clients.length + '</span>' +
            '<table class="infoTable">' +
            '<thead>' +
            '   <tr><th>ФИО</th>' +
            '       <th>Дата рождения</th>' +
            '       <th>Номер телефона</th>' +
            '       <th>Email</th>' +
            '       <th>Номер паспорта</th>' +
            '       <th>Личный (идентификационный) номер</th>' +
            '       <th>Девичья фамилия матери</th>' +
            '       <th>Коэффициент кредитной истории</th>';

        html += '   </tr>' +
        '</thead><tbody>';

        clients.forEach((client) => {
            if ( client.isConfirmed ) {
                html += '<tr>';
            } else {
                html += '<tr class="red">';
            }

            html += '<td>' + client.lastName + ' ' + client.firstName + ' ' + client.patronymic  + '</td>';
            html += '<td>' + moment(client.dateOfBirth).format('DD-MM-YYYY') + '</td>';

            html += '<td>' + client.phoneNumber + '</td>';
            html += '<td>' + client.email + '</td>';
            html += '<td>' + client.passportNumber + '</td>';
            html += '<td>' + client.passportIdNumber + '</td>';
            html += '<td>' + client.mothersMaidenName + '</td>';
            html += '<td>' + client.creditHistoryCoefficient + '</td>';

            if ( !client.isConfirmed ) {
                html += '<td><a data-clientid="' + client.id + '" class="acceptclient-button decision-button">Подтвердить</a> / ' +
                '<a data-clientid="' + client.id + '" class="declineclient-button decision-button">Отклонить</a></td>';
            }

            html += '</tr>';
        });

        html += '</tbody></table></div>';

        $('main').append(html);
    }
}