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
        $('main').html('');
    }

    static renderWelcomeMsg(bankEmployee) {
        $('#welcome-msg').html('Добро пожаловать, ' + bankEmployee.username);
    }

    static renderAside() {
        $('#activitiesList').append('<li id="operators">' + 'Операторы' + '</li>');
    }

    static renderBankInfo(bankInfo) {
        $('#baseMoney').html(bankInfo.baseMoney + ' BYR');
        $('#moneySupply').html(bankInfo.moneySupply + ' BYR');
        $('#reserveRatio').html(bankInfo.reserveRatio * 100 + ' %');
    }

    static renderCreditApps(creditApps) {
        if (creditApps.length === 0) {
            let html = '<span>Ничего нет</span>';
            $('main').append(html);
            return;
        }

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
            html += '<td>' +
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
                html += '<td>' +
                DataProvider.getOperators()[creditApp.bank_employee_id].username + '</td>';
            }

            html += '</tr>';
        });

        html += '</tbody></table></div>';

        $('main').append(html);
    }

    static renderDepositApps(depositApps) {
        if (depositApps.length === 0) {
            let html = '<span>Ничего нет</span>';
            $('main').append(html);
            return;
        }

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
            html += '<td>' +
            DataProvider.getDepositTypes()[depositApp.deposit_type_id].title + '</td>';
            html += '<td>' + depositApp.plannedSum + ' BYR</td>';

            html += '<td><a data-depositappid="' + depositApp.id + '" data-sum="' + depositApp.plannedSum +
            '" data-deposittypeid="' + depositApp.deposit_type_id +
            '" data-clientid="' + depositApp.client_id +
            '" class="acceptdepositapp-button decision-button">Принять</a> / ' +
            '<a data-depositappid="' + depositApp.id +
            '" class="declinedepositapp-button decision-button">Отклонить</a></td>';

            if (DataProvider.getBankEmployee().type === 'OVERSEER') {
                html += '<td>' +
                DataProvider.getOperators()[depositApp.bank_employee_id].username + '</td>';
            }

            html += '</tr>';
        });

        html += '</tbody></table></div>';

        $('main').append(html);
    }

    static renderCredits(credits) {
        if (credits.length === 0) {
            let html = '<span>Ничего нет</span>';
            $('main').append(html);
            return;
        }

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

            html += '<td>' +
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
        if (deposits.length === 0) {
            let html = '<span>Ничего нет</span>';
            $('main').append(html);
            return;
        }

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

            html += '<td>' +
            DataProvider.getDepositTypes()[deposit.deposit_type_id].title + '</td>';
            html += '<td>' + deposit.sum + ' BYR</td>';
            html += '<td>' + (deposit.lastInterestDate != null ? moment( deposit.lastInterestDate ).format('DD-MM-YYYY') : '')   + '</td>';

            html += '</tr>';
        });

        html += '</tbody></table></div>';

        $('main').append(html);
    }

    static renderClients(clients) {
        if (clients.length === 0) {
            let html = '<span>Ничего нет</span>';
            $('main').append(html);
            return;
        }

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
            '       <th>Коэффициент кредитной истории</th>' +
            '       <th>Скоринговая система</th>';

        html += '   </tr>' +
        '</thead><tbody>';

        clients.forEach((client) => {
            if ( client.isConfirmed ) {
                html += '<tr>';
            } else {
                html += '<tr class="red">';
            }

            html += '<td class="clientId underscore" data-clientid="' + client.id + '">' + client.lastName +
            ' ' + client.firstName + ' ' + client.patronymic  + '</td>';
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

            html += '<td><a target="_blank" href="' + URLS.GET_CLIENT_SCORING_SERVICE_RESULT.replace('${clientId}', client.id) +
            '">Ссылка</a></td>';

            html += '</tr>';
        });

        html += '</tbody></table></div>';

        $('main').append(html);
    }

    static renderOperators(operators) {
        if (operators.length === 0) {
            let html = '<span>Ничего нет</span>';
            if (DataProvider.getBankEmployee().type === 'OVERSEER') {
                html += '<div class="infoWrapper"><span class="title-create">Создать нового оператора</span>';

                html += '<form class="pure-form pure-form-aligned form-create">' +
                '<fieldset>' +
                '<div class="pure-control-group">' +
                '<label for="name">Идентификатор</label>' +
                '<input id="operator-username" type="text" placeholder="Идентификатор">' +
                '</div>' +
                '<div class="pure-control-group">' +
                '<label for="password">Пароль</label>' +
                '<input id="operator-password" type="password" placeholder="Пароль">' +
                '</div>' +
                '<div class="pure-controls">' +
                '<button id="operator-create-button" type="submit" class="pure-button pure-button-primary">Создать</button>' +
                '</div>' +
                '</fieldset>' +
                '</form>';

                html += '</div>';
                $('main').append(html);
            }

            return;
        }

        let html = '<div class="infoWrapper">' +
            '<span class="totalCount">Всего: ' + operators.length + '</span>' +
            '<table class="infoTable">' +
            '<thead>' +
            '   <tr><th>Оператор</th>' +
            '       <th>Кол-во заявок в обработке</th>' +
            '       <th>Дата создания</th>';

        html += '   </tr>' +
        '</thead><tbody>';

        operators.forEach((operator) => {
            html += '<tr>';

            html += '<td>' + operator.username + '</td>';
            html += '<td>' + operator.numberOfApplications + '</td>';
            html += '<td>' + moment(operator.created_at).format('DD-MM-YYYY') + '</td>';

            html += '</tr>';
        });

        html += '</tbody></table>';
        if (DataProvider.getBankEmployee().type === 'OVERSEER') {
            html += '<span class="title-create">Создать нового оператора</span>';

            html += '<form class="pure-form pure-form-aligned form-create">' +
            '<fieldset>' +
            '<div class="pure-control-group">' +
            '<label for="name">Идентификатор</label>' +
            '<input id="operator-username" type="text" placeholder="Идентификатор">' +
            '</div>' +
            '<div class="pure-control-group">' +
            '<label for="password">Пароль</label>' +
            '<input id="operator-password" type="password" placeholder="Пароль">' +
            '</div>' +
            '<div class="pure-controls">' +
            '<button id="operator-create-button" type="submit" class="pure-button pure-button-primary">Создать</button>' +
            '</div>' +
            '</fieldset>' +
            '</form>';
        }


        html += '</div>';


        $('main').append(html);
    }

    static renderCreditAppArchives(creditApps) {
        if (creditApps.length === 0) {
            let html = '<span>Ничего нет</span>';
            $('main').append(html);
            return;
        }

        let html = '<div class="infoWrapper">' +
            '<span class="totalCount">Всего: ' + creditApps.length + '</span>' +
            '<table class="infoTable">' +
            '<thead>' +
            '   <tr><th>Клиент</th>' +
            '       <th>Дата создания</th>' +
            '       <th>Дата рассмотрения</th>' +
            '       <th>Тип кредита</th>' +
            '       <th>Планируемая сумма</th>' +
            '       <th>Планируемый срок (в месяцах)</th>' +
            '       <th>Тип выплаты</th>' +
            '       <th>Статус</th>';

        if (DataProvider.getBankEmployee().type === 'OVERSEER') {
            html += '<th>Оператор</th>';
        }

        html += '   </tr>' +
        '</thead><tbody>';

        creditApps.forEach((creditApp) => {
            html += '<tr>';

            html += '<td class="clientId underscore" data-clientid="' + creditApp.client_id + '">' +
            DataProvider.getClients()[creditApp.client_id].lastName +
            ' ' + DataProvider.getClients()[creditApp.client_id].firstName +
            ' ' + DataProvider.getClients()[creditApp.client_id].patronymic  + '</td>';
            html += '<td>' + moment(creditApp.created_at).format('DD-MM-YYYY') + '</td>';
            html += '<td>' + moment(creditApp.deleted_at).format('DD-MM-YYYY') + '</td>';

            html += '<td>' +
            DataProvider.getCreditTypes()[creditApp.credit_type_id].title + '</td>';
            html += '<td>' + creditApp.plannedSum + ' BYR</td>';
            html += '<td>' + creditApp.plannedTerm + '</td>';
            html += '<td>' + (creditApp.repaymentType === 'EQUAL' ? 'Аннуитетный' : 'Дифференцированный') + '</td>';
            html += '<td>' + (creditApp.isConfirmed ? 'Принята' : 'Отклонена') + '</td>';

            if (DataProvider.getBankEmployee().type === 'OVERSEER') {
                html += '<td>' +
                DataProvider.getOperators()[creditApp.bank_employee_id].username + '</td>';
            }

            html += '</tr>';
        });

        html += '</tbody></table></div>';

        $('main').append(html);
    }

    static renderDepositAppArchives(depositApps) {
        if (depositApps.length === 0) {
            let html = '<span>Ничего нет</span>';
            $('main').append(html);
            return;
        }

        let html = '<div class="infoWrapper">' +
            '<span class="totalCount">Всего: ' + depositApps.length + '</span>' +
            '<table class="infoTable">' +
            '<thead>' +
            '   <tr><th>Клиент</th>' +
            '       <th>Дата создания</th>' +
            '       <th>Дата рассмотрения</th>' +
            '       <th>Тип вклада</th>' +
            '       <th>Сумма вклада</th>' +
            '       <th>Статус</th>';

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
            html += '<td>' + moment(depositApp.deleted_at).format('DD-MM-YYYY') + '</td>';
            html += '<td>' +
            DataProvider.getDepositTypes()[depositApp.deposit_type_id].title + '</td>';
            html += '<td>' + depositApp.plannedSum + ' BYR</td>';
            html += '<td>' + (depositApp.isConfirmed ? 'Принята' : 'Отклонена') + '</td>';

            if (DataProvider.getBankEmployee().type === 'OVERSEER') {
                html += '<td>' +
                DataProvider.getOperators()[depositApp.bank_employee_id].username + '</td>';
            }

            html += '</tr>';
        });

        html += '</tbody></table></div>';

        $('main').append(html);
    }

    static renderCreditArchives(credits) {
        if (credits.length === 0) {
            let html = '<span>Ничего нет</span>';
            $('main').append(html);
            return;
        }

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
            '       <th>Кол-во платежей</th>' +
            '       <th>Последняя дата оплаты</th>';

        html += '   </tr>' +
        '</thead><tbody>';

        credits.forEach((credit) => {
            html += '<tr>';

            html += '<td class="clientId underscore" data-clientid="' + credit.client_id + '">' +
            DataProvider.getClients()[credit.client_id].lastName +
            ' ' + DataProvider.getClients()[credit.client_id].firstName +
            ' ' + DataProvider.getClients()[credit.client_id].patronymic  + '</td>';
            html += '<td>' + moment(credit.startDate).format('DD-MM-YYYY') + '</td>';
            html += '<td>' + moment(credit.endDate).format('DD-MM-YYYY') + '</td>';

            html += '<td>' +
            DataProvider.getCreditTypes()[credit.credit_type_id].title + '</td>';
            html += '<td>' + (credit.repaymentType === 'EQUAL' ? 'Аннуитетный' : 'Дифференцированный') + '</td>';
            html += '<td>' + credit.sum + ' BYR</td>';
            html += '<td>' + credit.numberOfPayments + '</td>';
            html += '<td>' + (credit.lastPaymentDate != null ? moment( credit.lastPaymentDate ).format('DD-MM-YYYY') : '')   + '</td>';

            html += '</tr>';
        });

        html += '</tbody></table></div>';

        $('main').append(html);
    }

    static renderDepositArchives(deposits) {
        if (deposits.length === 0) {
            let html = '<span>Ничего нет</span>';
            $('main').append(html);
            return;
        }

        let html = '<div class="infoWrapper">' +
            '<span class="totalCount">Всего: ' + deposits.length + '</span>' +
            '<table class="infoTable">' +
            '<thead>' +
            '   <tr><th>Клиент</th>' +
            '       <th>Дата создания</th>' +
            '       <th>Дата окончания</th>' +
            '       <th>Тип вклада</th>' +
            '       <th>Сумма вклада</th>';

        html += '   </tr>' +
        '</thead><tbody>';

        deposits.forEach((deposit) => {
            html += '<tr>';

            html += '<td class="clientId underscore" data-clientid="' + deposit.client_id + '">' +
            DataProvider.getClients()[deposit.client_id].lastName +
            ' ' + DataProvider.getClients()[deposit.client_id].firstName +
            ' ' + DataProvider.getClients()[deposit.client_id].patronymic  + '</td>';
            html += '<td>' + moment(deposit.startDate).format('DD-MM-YYYY') + '</td>';
            html += '<td>' + moment(deposit.deleted_at).format('DD-MM-YYYY') + '</td>';

            html += '<td>' +
            DataProvider.getDepositTypes()[deposit.deposit_type_id].title + '</td>';
            html += '<td>' + deposit.sum + ' BYR</td>';

            html += '</tr>';
        });

        html += '</tbody></table></div>';

        $('main').append(html);
    }

    static renderCreditCats(creditCats) {
        if (creditCats.length === 0) {
            let html = '<span>Ничего нет</span>';
            if (DataProvider.getBankEmployee().type === 'OVERSEER') {
                html += '<div class="infoWrapper"><span class="title-create">Создать новую кредитную категорию</span>';

                html += '<form class="pure-form pure-form-aligned form-create">' +
                '<fieldset>' +
                '<div class="pure-control-group">' +
                '<label for="name">Название</label>' +
                '<input id="credit-cat-title" type="text">' +
                '</div>' +
                '<div class="pure-controls">' +
                '<button id="credit-cat-create-button" type="submit" class="pure-button pure-button-primary">Создать</button>' +
                '</div>' +
                '</fieldset>' +
                '</form>';

                html += '</div>';
                $('main').append(html);
            }

            return;
        }

        let html = '<div class="infoWrapper">' +
            '<span class="totalCount">Всего: ' + creditCats.length + '</span>' +
            '<table class="infoTable">' +
            '<thead>' +
            '   <tr><th>Название</th>' +
            '       <th>Дата создания</th>';

        html += '   </tr>' +
        '</thead><tbody>';

        creditCats.forEach((creditCat) => {
            html += '<tr>';

            html += '<td>' + creditCat.title + '</td>';
            html += '<td>' + moment(creditCat.created_at).format('DD-MM-YYYY') + '</td>';

            html += '</tr>';
        });

        html += '</tbody></table>';

        if (DataProvider.getBankEmployee().type === 'OVERSEER') {
            html += '<span class="title-create">Создать новую кредитную категорию</span>';

            html += '<form class="pure-form pure-form-aligned form-create">' +
            '<fieldset>' +
            '<div class="pure-control-group">' +
            '<label for="name">Название</label>' +
            '<input id="credit-cat-title" type="text">' +
            '</div>' +
            '<div class="pure-controls">' +
            '<button id="credit-cat-create-button" type="submit" class="pure-button pure-button-primary">Создать</button>' +
            '</div>' +
            '</fieldset>' +
            '</form>';
        }


        html += '</div>';


        $('main').append(html);
    }

    static renderDepositTypes(depositTypes) {
        if (depositTypes.length === 0) {
            let html = '<span>Ничего нет</span>';
            if (DataProvider.getBankEmployee().type === 'OVERSEER') {
                html += '<div class="infoWrapper"><span class="title-create">Создать новый тип депозитов</span>';

                html += '<form class="pure-form pure-form-aligned form-create">' +
                '<fieldset>' +
                '<div class="pure-control-group">' +
                '<label for="name">Название</label>' +
                '<input id="deposit-type-title" type="text">' +
                '</div>' +
                '<div class="pure-control-group">' +
                '<label for="name">Описание</label>' +
                '<textarea id="deposit-type-description" class="pure-input"></textarea>' +
                '</div>' +
                '<div class="pure-control-group">' +
                '<label for="name">Процент по вкладу</label>' +
                '<input id="deposit-type-interest" type="text">' +
                '</div>' +
                '<div class="pure-control-group">' +
                '<label for="name">Минимальная сумма вклада</label>' +
                '<input id="deposit-type-minSum" type="text">' +
                '</div>' +
                '<div class="pure-controls">' +
                '<button id="deposit-type-create-button" type="submit" class="pure-button pure-button-primary">Создать</button>' +
                '</div>' +
                '</fieldset>' +
                '</form>';

                html += '</div>';
                $('main').append(html);
            }

            return;
        }

        let html = '<div class="infoWrapper">' +
            '<span class="totalCount">Всего: ' + depositTypes.length + '</span>' +
            '<table class="infoTable">' +
            '<thead>' +
            '   <tr><th>Название</th>' +
            '       <th>Дата создания</th>' +
            '       <th>Описание</th>' +
            '       <th>Процент по вкладу</th>' +
            '       <th>Минимальная сумма вклада</th>';

        html += '   </tr>' +
        '</thead><tbody>';

        depositTypes.forEach((depositType) => {
            html += '<tr>';

            html += '<td>' + depositType.title + '</td>';
            html += '<td>' + moment(depositType.created_at).format('DD-MM-YYYY') + '</td>';
            html += '<td>' + depositType.description + '</td>';
            html += '<td>' + (depositType.interest * 100) + '%</td>';
            html += '<td>' + depositType.minSum + ' BYR</td>';

            html += '</tr>';
        });

        html += '</tbody></table>';
        if (DataProvider.getBankEmployee().type === 'OVERSEER') {
            html += '<span class="title-create">Создать новый тип депозитов</span>';

            html += '<form class="pure-form pure-form-aligned form-create">' +
            '<fieldset>' +
            '<div class="pure-control-group">' +
            '<label for="name">Название</label>' +
            '<input id="deposit-type-title" type="text">' +
            '</div>' +
            '<div class="pure-control-group">' +
            '<label for="name">Описание</label>' +
            '<textarea id="deposit-type-description" class="pure-input"></textarea>' +
            '</div>' +
            '<div class="pure-control-group">' +
            '<label for="name">Процент по вкладу</label>' +
            '<input id="deposit-type-interest" type="text">' +
            '</div>' +
            '<div class="pure-control-group">' +
            '<label for="name">Минимальная сумма вклада</label>' +
            '<input id="deposit-type-minSum" type="text">' +
            '</div>' +
            '<div class="pure-controls">' +
            '<button id="deposit-type-create-button" type="submit" class="pure-button pure-button-primary">Создать</button>' +
            '</div>' +
            '</fieldset>' +
            '</form>';
        }

        html += '</div>';

        $('main').append(html);
    }

    static renderCreditTypes(creditTypes) {
        if (creditTypes.length === 0) {
            let html = '<span>Ничего нет</span>';
            if (DataProvider.getBankEmployee().type === 'OVERSEER') {
                html += '<div class="infoWrapper"><span class="title-create">Создать новый тип кредитов</span>';

                html += '<form class="pure-form pure-form-aligned form-create">' +
                '<fieldset>' +
                '<div class="pure-control-group">' +
                '<label for="name">Название</label>' +
                '<input id="credit-type-title" type="text">' +
                '</div>' +
                '<div class="pure-control-group">' +
                '<label for="name">Описание</label>' +
                '<textarea id="credit-type-description" class="pure-input"></textarea>' +
                '</div>' +
                '<div class="pure-control-group">' +
                '<label for="name">Минимальная сумма кредита</label>' +
                '<input id="credit-type-minSum" type="text">' +
                '</div>' +
                '<div class="pure-control-group">' +
                '<label for="name">Максимальная сумма кредита</label>' +
                '<input id="credit-type-maxSum" type="text">' +
                '</div>' +
                '<div class="pure-control-group">' +
                '<label for="name">Минимальное кол-во месяцев</label>' +
                '<input id="credit-type-minTerm" type="text">' +
                '</div>' +
                '<div class="pure-control-group">' +
                '<label for="name">Максимальное кол-во месяцев</label>' +
                '<input id="credit-type-maxTerm" type="text">' +
                '</div>' +
                '<div class="pure-control-group">' +
                '<label for="name">Процент по кредиту</label>' +
                '<input id="credit-type-interest" type="text">' +
                '</div>' +
                '<div class="pure-control-group"><label for="state">Категория</label>' +
                '<select id="credit-type-catId">';

                for (var creditCatId in DataProvider.getCreditCats()) {
                    if (DataProvider.getCreditCats().hasOwnProperty(creditCatId)) {
                        html += '<option value="' + creditCatId + '">' + DataProvider.getCreditCats()[creditCatId].title + '</option>';
                    }
                }

                html += '</select></div>' +
                '<div class="pure-controls">' +
                '<button id="credit-type-create-button" type="submit" class="pure-button pure-button-primary">Создать</button>' +
                '</div>' +
                '</fieldset>' +
                '</form>';

                html += '</div>';
                $('main').append(html);
            }

            return;
        }

        let html = '<div class="infoWrapper">' +
            '<span class="totalCount">Всего: ' + creditTypes.length + '</span>' +
            '<table class="infoTable">' +
            '<thead>' +
            '   <tr><th>Название</th>' +
            '       <th>Дата создания</th>' +
            '       <th>Описание</th>' +
            '       <th>Процент по кредиту</th>' +
            '       <th>Минимальная сумма кредита</th>' +
            '       <th>Максимальная сумма кредита</th>' +
            '       <th>Минимальное кол-во месяцев</th>' +
            '       <th>Максимальное кол-во месяцев</th>' +
            '       <th>Категория</th>';

        html += '   </tr>' +
        '</thead><tbody>';

        creditTypes.forEach((creditType) => {
            html += '<tr>';

            html += '<td>' + creditType.title + '</td>';
            html += '<td>' + moment(creditType.created_at).format('DD-MM-YYYY') + '</td>';
            html += '<td>' + creditType.description + '</td>';
            html += '<td>' + (creditType.interest * 100) + '%</td>';
            html += '<td>' + creditType.minSum + ' BYR</td>';
            html += '<td>' + creditType.maxSum + ' BYR</td>';
            html += '<td>' + creditType.minTerm + '</td>';
            html += '<td>' + creditType.maxTerm + '</td>';
            html += '<td>' + DataProvider.getCreditCats()[creditType.credit_category_id].title + '</td>';

            html += '</tr>';
        });

        html += '</tbody></table>';
        if (DataProvider.getBankEmployee().type === 'OVERSEER') {
            html += '<div class="infoWrapper"><span class="title-create">Создать новый тип кредитов</span>';

            html += '<form class="pure-form pure-form-aligned form-create">' +
            '<fieldset>' +
            '<div class="pure-control-group">' +
            '<label for="name">Название</label>' +
            '<input id="credit-type-title" type="text">' +
            '</div>' +
            '<div class="pure-control-group">' +
            '<label for="name">Описание</label>' +
            '<textarea id="credit-type-description" class="pure-input"></textarea>' +
            '</div>' +
            '<div class="pure-control-group">' +
            '<label for="name">Минимальная сумма кредита</label>' +
            '<input id="credit-type-minSum" type="text">' +
            '</div>' +
            '<div class="pure-control-group">' +
            '<label for="name">Максимальная сумма кредита</label>' +
            '<input id="credit-type-maxSum" type="text">' +
            '</div>' +
            '<div class="pure-control-group">' +
            '<label for="name">Минимальное кол-во месяцев</label>' +
            '<input id="credit-type-minTerm" type="text">' +
            '</div>' +
            '<div class="pure-control-group">' +
            '<label for="name">Максимальное кол-во месяцев</label>' +
            '<input id="credit-type-maxTerm" type="text">' +
            '</div>' +
            '<div class="pure-control-group">' +
            '<label for="name">Процент по кредиту</label>' +
            '<input id="credit-type-interest" type="text">' +
            '</div>' +
            '<div class="pure-control-group"><label for="state">Категория</label>' +
            '<select id="credit-type-catId">';

            for (var creditCatId in DataProvider.getCreditCats()) {
                if (DataProvider.getCreditCats().hasOwnProperty(creditCatId)) {
                    html += '<option value="' + creditCatId + '">' + DataProvider.getCreditCats()[creditCatId].title + '</option>';
                }
            }

            html += '</select></div>' +
            '<div class="pure-controls">' +
            '<button id="credit-type-create-button" type="submit" class="pure-button pure-button-primary">Создать</button>' +
            '</div>' +
            '</fieldset>' +
            '</form>';
        }

        html += '</div>';

        $('main').append(html);
    }

    static renderClientInfo(data) {
        let html = '<div class="infoWrapper"><span class="title-create">' +
            DataProvider.getClients()[data.clientId].lastName + ' ' +
            DataProvider.getClients()[data.clientId].firstName + ' ' +
            DataProvider.getClients()[data.clientId].patronymic + '</span>';

        html += '<h2>На счету: ' + data.clientAccount.amount + ' BYR</h2>';
        html += '<p><a target="_blank" class="scoring_link" href="' + URLS.GET_CLIENT_SCORING_SERVICE_RESULT.replace('${clientId}', data.clientId) + '">Результат скоринга</a></p>';
        html += '<p><a target="_blank" class="scoring_link" href="' + URLS.GET_CLIENT_SCORING_SERVICE_ANSWERS.replace('${clientId}', data.clientId) + '">Ответы скоринга</a></p>';

        html += '<h2>Активные кредиты</h2>';
        if (data.credits.length === 0) {
            html += '<span>Ничего нет</span>';
        } else {
            html += '<span class="totalCount">Всего: ' + data.credits.length + '</span>' +
            '<table class="infoTable">' +
            '<thead>' +
            '   <tr>' +
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

            data.credits.forEach((credit) => {
                if ( credit.overdueSum > 0 ) {
                    html += '<tr class="red">';
                } else {
                    html += '<tr>';
                }

                html += '<td>' + moment(credit.startDate).format('DD-MM-YYYY') + '</td>';
                html += '<td>' + moment(credit.endDate).format('DD-MM-YYYY') + '</td>';

                html += '<td>' +
                DataProvider.getCreditTypes()[credit.credit_type_id].title + '</td>';
                html += '<td>' + (credit.repaymentType === 'EQUAL' ? 'Аннуитетный' : 'Дифференцированный') + '</td>';
                html += '<td>' + credit.sum + ' BYR</td>';
                html += '<td>' + credit.outstandingLoan + ' BYR</td>';
                html += '<td>' + credit.numberOfPayments + '</td>';
                html += '<td>' + (credit.lastPaymentDate != null ? moment( credit.lastPaymentDate ).format('DD-MM-YYYY') : '')   + '</td>';
                html += '<td>' + credit.overdueSum + ' BYR</td>';

                html += '</tr>';
            });

            html += '</tbody></table>';
        }

        html += '<h2>Активные депозиты</h2>';
        if (data.deposits.length === 0) {
            html += '<span>Ничего нет</span>';
        } else {
            html += '<span class="totalCount">Всего: ' + data.deposits.length + '</span>' +
            '<table class="infoTable">' +
            '<thead>' +
            '   <tr>' +
            '       <th>Дата создания</th>' +
            '       <th>Тип вклада</th>' +
            '       <th>Сумма вклада</th>' +
            '       <th>Последняя дата начисления процентов</th>';

            html += '   </tr>' +
            '</thead><tbody>';

            data.deposits.forEach((deposit) => {
                html += '<tr>';

                html += '<td>' + moment(deposit.startDate).format('DD-MM-YYYY') + '</td>';

                html += '<td>' +
                DataProvider.getDepositTypes()[deposit.deposit_type_id].title + '</td>';
                html += '<td>' + deposit.sum + ' BYR</td>';
                html += '<td>' + (deposit.lastInterestDate != null ? moment( deposit.lastInterestDate ).format('DD-MM-YYYY') : '')   + '</td>';

                html += '</tr>';
            });

            html += '</tbody></table>';
        }


        html += '<h2>Активные заявки на кредиты</h2>';
        if (data.creditApps.length === 0) {
            html += '<span>Ничего нет</span>';
        } else {
            html += '<span class="totalCount">Всего: ' + data.creditApps.length + '</span>' +
            '<table class="infoTable">' +
            '<thead>' +
            '   <tr>' +
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

            data.creditApps.forEach((creditApp) => {
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

                html += '<td>' + creditHistoryCoefficient + '</td>';
                html += '<td>' + moment(creditApp.created_at).format('DD-MM-YYYY') + '</td>';
                html += '<td>' +
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
                    html += '<td>' +
                    DataProvider.getOperators()[creditApp.bank_employee_id].username + '</td>';
                }

                html += '</tr>';
            });

            html += '</tbody></table>';
        }


        html += '<h2>Активные заявки на депозиты</h2>';
        if (data.depositApps.length === 0) {
            html += '<span>Ничего нет</span>';
        } else {
            html += '<div class="infoWrapper">' +
            '<span class="totalCount">Всего: ' + data.depositApps.length + '</span>' +
            '<table class="infoTable">' +
            '<thead>' +
            '   <tr>' +
            '       <th>Дата создания</th>' +
            '       <th>Тип вклада</th>' +
            '       <th>Сумма вклада</th>' +
            '       <th></th>';

            if (DataProvider.getBankEmployee().type === 'OVERSEER') {
                html += '<th>Оператор</th>';
            }

            html += '   </tr>' +
            '</thead><tbody>';

            data.depositApps.forEach((depositApp) => {
                html += '<tr>';

                html += '<td>' + moment(depositApp.created_at).format('DD-MM-YYYY') + '</td>';
                html += '<td>' +
                DataProvider.getDepositTypes()[depositApp.deposit_type_id].title + '</td>';
                html += '<td>' + depositApp.plannedSum + ' BYR</td>';

                html += '<td><a data-depositappid="' + depositApp.id + '" data-sum="' + depositApp.plannedSum +
                '" data-deposittypeid="' + depositApp.deposit_type_id +
                '" data-clientid="' + depositApp.client_id +
                '" class="acceptdepositapp-button decision-button">Принять</a> / ' +
                '<a data-depositappid="' + depositApp.id +
                '" class="declinedepositapp-button decision-button">Отклонить</a></td>';

                if (DataProvider.getBankEmployee().type === 'OVERSEER') {
                    html += '<td>' +
                    DataProvider.getOperators()[depositApp.bank_employee_id].username + '</td>';
                }

                html += '</tr>';
            });

            html += '</tbody></table>';
        }

        html += '<span class="title-create">Архивы</span>';

        html += '<h2>Кредиты</h2>';
        if (data.creditsArchives.length === 0) {
            html += '<span>Ничего нет</span>';
        } else {
            html += '<span class="totalCount">Всего: ' + data.creditsArchives.length + '</span>' +
            '<table class="infoTable">' +
            '<thead>' +
            '   <tr>' +
            '       <th>Дата создания</th>' +
            '       <th>Дата окончания</th>' +
            '       <th>Тип кредита</th>' +
            '       <th>Тип выплаты</th>' +
            '       <th>Сумма кредита</th>' +
            '       <th>Кол-во платежей</th>' +
            '       <th>Последняя дата оплаты</th>';

            html += '   </tr>' +
            '</thead><tbody>';

            data.creditsArchives.forEach((credit) => {
                html += '<tr>';

                html += '<td>' + moment(credit.startDate).format('DD-MM-YYYY') + '</td>';
                html += '<td>' + moment(credit.endDate).format('DD-MM-YYYY') + '</td>';

                html += '<td>' +
                DataProvider.getCreditTypes()[credit.credit_type_id].title + '</td>';
                html += '<td>' + (credit.repaymentType === 'EQUAL' ? 'Аннуитетный' : 'Дифференцированный') + '</td>';
                html += '<td>' + credit.sum + ' BYR</td>';
                html += '<td>' + credit.numberOfPayments + '</td>';
                html += '<td>' + (credit.lastPaymentDate != null ? moment( credit.lastPaymentDate ).format('DD-MM-YYYY') : '')   + '</td>';

                html += '</tr>';
            });

            html += '</tbody></table>';
        }

        html += '<h2>Депозиты</h2>';
        if (data.depositsArchives.length === 0) {
            html += '<span>Ничего нет</span>';
        } else {
            html += '<span class="totalCount">Всего: ' + data.depositsArchives.length + '</span>' +
            '<table class="infoTable">' +
            '<thead>' +
            '   <tr>' +
            '       <th>Дата создания</th>' +
            '       <th>Дата окончания</th>' +
            '       <th>Тип вклада</th>' +
            '       <th>Сумма вклада</th>';

            html += '   </tr>' +
            '</thead><tbody>';

            data.depositsArchives.forEach((deposit) => {
                html += '<tr>';

                html += '<td>' + moment(deposit.startDate).format('DD-MM-YYYY') + '</td>';
                html += '<td>' + moment(deposit.deleted_at).format('DD-MM-YYYY') + '</td>';

                html += '<td>' +
                DataProvider.getDepositTypes()[deposit.deposit_type_id].title + '</td>';
                html += '<td>' + deposit.sum + ' BYR</td>';

                html += '</tr>';
            });

            html += '</tbody></table>';
        }


        html += '<h2>Заявки на кредиты</h2>';
        if (data.creditAppsArchives.length === 0) {
            html += '<span>Ничего нет</span>';
        } else {
            html += '<span class="totalCount">Всего: ' + data.creditAppsArchives.length + '</span>' +
            '<table class="infoTable">' +
            '<thead>' +
            '   <tr>' +
            '       <th>Дата создания</th>' +
            '       <th>Дата рассмотрения</th>' +
            '       <th>Тип кредита</th>' +
            '       <th>Планируемая сумма</th>' +
            '       <th>Планируемый срок (в месяцах)</th>' +
            '       <th>Тип выплаты</th>' +
            '       <th>Статус</th>';

            if (DataProvider.getBankEmployee().type === 'OVERSEER') {
                html += '<th>Оператор</th>';
            }

            html += '   </tr>' +
            '</thead><tbody>';

            data.creditAppsArchives.forEach((creditApp) => {
                html += '<tr>';

                html += '<td>' + moment(creditApp.created_at).format('DD-MM-YYYY') + '</td>';
                html += '<td>' + moment(creditApp.deleted_at).format('DD-MM-YYYY') + '</td>';

                html += '<td>' +
                DataProvider.getCreditTypes()[creditApp.credit_type_id].title + '</td>';
                html += '<td>' + creditApp.plannedSum + ' BYR</td>';
                html += '<td>' + creditApp.plannedTerm + '</td>';
                html += '<td>' + (creditApp.repaymentType === 'EQUAL' ? 'Аннуитетный' : 'Дифференцированный') + '</td>';
                html += '<td>' + (creditApp.isConfirmed ? 'Принята' : 'Отклонена') + '</td>';

                if (DataProvider.getBankEmployee().type === 'OVERSEER') {
                    html += '<td>' +
                    DataProvider.getOperators()[creditApp.bank_employee_id].username + '</td>';
                }

                html += '</tr>';
            });

            html += '</tbody></table>';
        }


        html += '<h2>Заявки на депозиты</h2>';
        if (data.depositAppsArchives.length === 0) {
            html += '<span>Ничего нет</span>';
        } else {
            html += '<span class="totalCount">Всего: ' + data.depositAppsArchives.length + '</span>' +
            '<table class="infoTable">' +
            '<thead>' +
            '   <tr>' +
            '       <th>Дата создания</th>' +
            '       <th>Дата рассмотрения</th>' +
            '       <th>Тип вклада</th>' +
            '       <th>Сумма вклада</th>' +
            '       <th>Статус</th>';

            if (DataProvider.getBankEmployee().type === 'OVERSEER') {
                html += '<th>Оператор</th>';
            }

            html += '   </tr>' +
            '</thead><tbody>';

            data.depositAppsArchives.forEach((depositApp) => {
                html += '<tr>';

                html += '<td>' + moment(depositApp.created_at).format('DD-MM-YYYY') + '</td>';
                html += '<td>' + moment(depositApp.deleted_at).format('DD-MM-YYYY') + '</td>';
                html += '<td>' +
                DataProvider.getDepositTypes()[depositApp.deposit_type_id].title + '</td>';
                html += '<td>' + depositApp.plannedSum + ' BYR</td>';
                html += '<td>' + (depositApp.isConfirmed ? 'Принята' : 'Отклонена') + '</td>';

                if (DataProvider.getBankEmployee().type === 'OVERSEER') {
                    html += '<td>' +
                    DataProvider.getOperators()[depositApp.bank_employee_id].username + '</td>';
                }

                html += '</tr>';
            });

            html += '</tbody></table>';
        }


        html += '</div>';
        $('main').append(html);
    }

    static renderClientsArchives(clients) {
        if (clients.length === 0) {
            let html = '<span>Ничего нет</span>';
            $('main').append(html);
            return;
        }

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
            '       <th>Коэффициент кредитной истории</th>' +
            '       <th>Скоринговая система</th>';

        html += '   </tr>' +
        '</thead><tbody>';

        clients.forEach((client) => {
            html += '<tr>';

            html += '<td class="clientId underscore" data-clientid="' + client.id + '">' + client.lastName +
            ' ' + client.firstName + ' ' + client.patronymic  + '</td>';
            html += '<td>' + moment(client.dateOfBirth).format('DD-MM-YYYY') + '</td>';

            html += '<td>' + client.phoneNumber + '</td>';
            html += '<td>' + client.email + '</td>';
            html += '<td>' + client.passportNumber + '</td>';
            html += '<td>' + client.passportIdNumber + '</td>';
            html += '<td>' + client.mothersMaidenName + '</td>';
            html += '<td>' + client.creditHistoryCoefficient + '</td>';

            html += '<td><a target="_blank" href="' + URLS.GET_CLIENT_SCORING_SERVICE.replace('${clientLink}', client.scoringFormId) +
            '">Ссылка</a></td>';

            html += '</tr>';
        });

        html += '</tbody></table></div>';

        $('main').append(html);
    }

}
