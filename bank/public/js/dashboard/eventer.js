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

        $('#depositApps').on('click', () => {
            $('main').empty();
            $('.loader').show();
            DataProvider.getDepositApps(0, 1111)
                .then((data) => {
                    $('.loader').hide();
                    alertify.success("Данные загружены");
                    Viewer.renderDepositApps(data.depositApps);
                })
                .fail(() => {
                    $('.loader').hide();
                    alertify.error("Ошибка");
                })
        });

        $('#credits').on('click', () => {
            $('main').empty();
            $('.loader').show();
            DataProvider.getCredits(0, 1111)
                .then((data) => {
                    $('.loader').hide();
                    alertify.success("Данные загружены");
                    Viewer.renderCredits(data.credits);
                })
                .fail(() => {
                    $('.loader').hide();
                    alertify.error("Ошибка");
                })
        });

        $('#deposits').on('click', () => {
            $('main').empty();
            $('.loader').show();
            DataProvider.getDeposits(0, 1111)
                .then((data) => {
                    $('.loader').hide();
                    alertify.success("Данные загружены");
                    Viewer.renderDeposits(data.deposits);
                })
                .fail(() => {
                    $('.loader').hide();
                    alertify.error("Ошибка");
                })
        });

        $('#clients').on('click', () => {
            $('main').empty();
            $('.loader').show();
            DataProvider.getClientsRemote(0, 1111)
                .then((data) => {
                    $('.loader').hide();
                    alertify.success("Данные загружены");
                    Viewer.renderClients(data.clients);
                })
                .fail(() => {
                    $('.loader').hide();
                    alertify.error("Ошибка");
                })
        });

        $('#creditAppsArchives').on('click', () => {
            $('main').empty();
            $('.loader').show();
            DataProvider.getCreditAppArchives(0, 1111)
                .then((data) => {
                    $('.loader').hide();
                    alertify.success("Данные загружены");

                    if (DataProvider.getBankEmployeeType() === 'OVERSEER') {
                        Viewer.renderCreditAppArchives(data.creditApps);
                    } else {
                        let creditApps = [];
                        data.creditApps.map((creditApp) => {
                            if (creditApp.bank_employee_id === DataProvider.getBankEmployeeId()) {
                                creditApps.push(creditApp);
                            }
                        });
                        Viewer.renderCreditAppArchives(creditApps);
                    }
                })
                .fail(() => {
                    $('.loader').hide();
                    alertify.error("Ошибка");
                })
        });

        $('#depositAppsArchives').on('click', () => {
            $('main').empty();
            $('.loader').show();
            DataProvider.getDepositAppArchives(0, 1111)
                .then((data) => {
                    $('.loader').hide();
                    alertify.success("Данные загружены");

                    if (DataProvider.getBankEmployeeType() === 'OVERSEER') {
                        Viewer.renderDepositAppArchives(data.depositApps);
                    } else {
                        let depositApps = [];
                        data.depositApps.map((depositApp) => {
                            if (depositApp.bank_employee_id === DataProvider.getBankEmployeeId()) {
                                depositApps.push(depositApp);
                            }
                        });
                        Viewer.renderDepositAppArchives(depositApps);
                    }
                })
                .fail(() => {
                    $('.loader').hide();
                    alertify.error("Ошибка");
                })
        });

        $('#creditArchives').on('click', () => {
            $('main').empty();
            $('.loader').show();
            DataProvider.getCreditArchives(0, 1111)
                .then((data) => {
                    $('.loader').hide();
                    alertify.success("Данные загружены");
                    Viewer.renderCreditArchives(data.credits);
                })
                .fail(() => {
                    $('.loader').hide();
                    alertify.error("Ошибка");
                })
        });

        $('#depositArchives').on('click', () => {
            $('main').empty();
            $('.loader').show();
            DataProvider.getDepositArchives(0, 1111)
                .then((data) => {
                    $('.loader').hide();
                    alertify.success("Данные загружены");
                    Viewer.renderDepositArchives(data.deposits);
                })
                .fail(() => {
                    $('.loader').hide();
                    alertify.error("Ошибка");
                })
        });

        $('body').on('click', '#operators', () => {
            $('main').empty();
            $('.loader').show();
            DataProvider.getOperatorsRemote(0, 1111)
                .then((data) => {
                    DataProvider.setOperators(data.bankEmployees);
                    $('.loader').hide();
                    alertify.success("Данные загружены");
                    var operators = [];
                    data.bankEmployees.map((bankEmployee) => {
                        if (bankEmployee.type === 'OPERATOR') {
                            operators.push(bankEmployee);
                        }
                    });

                    Viewer.renderOperators(operators);
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

    static bindDepositAppsTabEvents() {
        $('main').on('click', '.acceptdepositapp-button', function() {
            let isSure = confirm('Вы уверены?');
            if (!isSure) {
                return;
            }

            $('.loader').show();
            $('.overlay').show();

            DataManipulator.acceptDepositApp({
                depositAppId: $(this).data('depositappid'),
                sum: +$(this).data('sum'),
                depositTypeId: $(this).data('deposittypeid'),
                clientId: $(this).data('clientid')
            })
            .then(() => {
                return DataProvider.getDepositApps(0, 1111);
            })
            .then((data) => {
                $('main').empty();
                Viewer.renderDepositApps(data.depositApps);
                $('.loader').hide();
                $('.overlay').hide();
                alertify.success('Депозит успешно создан');
            })
            .fail(() => {
                $('.loader').hide();
                $('.overlay').hide();
                alertify.error('Ошибка');
            });
        });

        $('main').on('click', '.declinedepositapp-button', function() {
            let isSure = confirm('Вы уверены?');
            if (!isSure) {
                return;
            }

            $('.loader').show();
            $('.overlay').show();

            DataManipulator.declineDepositApp({
                depositAppId: $(this).data('depositappid')
            })
            .then(() => {
                return DataProvider.getDepositApps(0, 1111);
            })
            .then((data) => {
                $('main').empty();
                Viewer.renderDepositApps(data.depositApps);
                $('.loader').hide();
                $('.overlay').hide();
                alertify.log('Заявка на депозит отменена');
            })
            .fail(() => {
                $('.loader').hide();
                $('.overlay').hide();
                alertify.error('Ошибка');
            });
        });
    }

    static bindClientsTabEvents() {
        $('main').on('click', '.acceptclient-button', function() {
            let isSure = confirm('Вы уверены?');
            if (!isSure) {
                return;
            }

            $('.loader').show();
            $('.overlay').show();

            DataManipulator.acceptClient({
                clientId: $(this).data('clientid')
            })
            .then(() => {
                return DataProvider.getClientsRemote(0, 1111);
            })
            .then((data) => {
                $('main').empty();
                Viewer.renderClients(data.clients);
                $('.loader').hide();
                $('.overlay').hide();
                alertify.success('Новый клиент успешно создан');
            })
            .fail(() => {
                $('.loader').hide();
                $('.overlay').hide();
                alertify.error('Ошибка');
            });
        });

        $('main').on('click', '.declineclient-button', function() {
            let isSure = confirm('Вы уверены?');
            if (!isSure) {
                return;
            }

            $('.loader').show();
            $('.overlay').show();

            DataManipulator.declineClient({
                clientId: $(this).data('clientid')
            })
            .then(() => {
                return DataProvider.getClientsRemote(0, 1111);
            })
            .then((data) => {
                $('main').empty();
                Viewer.renderClients(data.clients);
                $('.loader').hide();
                $('.overlay').hide();
                alertify.log('Клиент удален');
            })
            .fail(() => {
                $('.loader').hide();
                $('.overlay').hide();
                alertify.error('Ошибка');
            });
        });
    }

    static bindOperatorsTabEvents() {
        $('main').on('click', '#operator-create-button', function(e) {
            e.preventDefault();
            let username = $('#operator-username').val();
            let password = $('#operator-password').val();

            if (username === '' || password === '') {
                alertify.error('Заполните поля');
                return;
            }

            let isSure = confirm('Вы уверены?');
            if (!isSure) {
                return;
            }

            $('.loader').show();
            $('.overlay').show();

            DataManipulator.createOperator(username, password)
            .then(() => {
                return DataProvider.getOperatorsRemote(0, 1111);
            })
            .then((data) => {
                $('main').empty();
                DataProvider.setOperators(data.bankEmployees);
                let operators = [];
                data.bankEmployees.map((bankEmployee) => {
                    if (bankEmployee.type === 'OPERATOR') {
                        operators.push(bankEmployee);
                    }
                });

                Viewer.renderOperators(operators);

                $('.loader').hide();
                $('.overlay').hide();
                alertify.success('Оператор "' + username + '" создан');
            })
            .fail(() => {
                $('.loader').hide();
                $('.overlay').hide();
                alertify.error('Ошибка');
            });
        });
    }

}