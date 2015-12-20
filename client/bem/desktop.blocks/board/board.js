modules.define('board', ['i-bem__dom', 'jquery', 'BEMHTML', 'alertifyjs', 'validator'], function(provide, BEMDOM, $, BEMHTML) {

provide(BEMDOM.decl('board', {
    onSetMod: {
        'js': function() {
            alertify.logPosition("bottom right");
            this.init();

            var withdraw = this.findBlockInside({ block: 'button', modName: 'id', modVal: 'withdraw' }),
                deposit = this.findBlockInside({ block: 'button', modName: 'id', modVal: 'deposit' });

            withdraw.on('click', this.onWithdraw.bind(this));
            deposit.on('click', this.onDeposit.bind(this));
        },
        'reload': {
            'yes': function() {
                this.init();
            }
        }
    },

    init: function() {
        $.ajax({
            url: BEMDOM.url + 'api/client/accounts/' + localStorage.getItem('clientId'),
            method: 'GET',
            headers: { 'Authorization': localStorage.getItem('token') }
        })
        .done(this.onDone.bind(this));
    },

    onDone: function(data) {
        this.elem('account').html('У вас на счету: ' + data.clientAccount.amount + ' бел. руб.');
    },

    onWithdraw: function() {
        var _this = this;

        alertify
            .defaultValue('100000')
            .prompt('Укажите сумму которую хотите снять',
                function (val, ev) {
                  ev.preventDefault();

                  var valid = validate({sum: val}, { sum: {numericality:{onlyInteger: true}}});

                    if (!valid) {
                        alertify.success('Отправлен запрос на снятие: ' + val + ' бел. руб.');
                        $.ajax({
                            url: BEMDOM.url + 'api/client/accounts/'+localStorage.getItem('clientId')+'/withdraw',
                            method: 'POST',
                            data: { sum: val },
                            headers: { 'Authorization': localStorage.getItem('token') }
                        })
                        .done(function() {
                            alertify.success('Операция успешно завершена');
                            _this.init();
                        })
                        .fail(function() {
                            alertify.error('Ошибка операции');
                        });
                    } else {
                        alertify.error('Введена некорректная сумма');
                    }

                }, function(ev) {
                    ev.preventDefault();

                    alertify.error('Операция отменена');
                }
            );
    },

    onDeposit: function() {
        var _this = this;

        alertify
            .defaultValue('100000')
            .prompt('Укажите сумму которую хотите снять',
                function (val, ev) {
                  ev.preventDefault();

                  var valid = validate({sum: val}, { sum: {numericality:{onlyInteger: true}}});

                    if (!valid) {
                        alertify.success('Отправлен запрос на снятие: ' + val + ' бел. руб.');
                        $.ajax({
                            url: BEMDOM.url + 'api/client/accounts/'+localStorage.getItem('clientId')+'/deposit',
                            method: 'POST',
                            data: { sum: val },
                            headers: { 'Authorization': localStorage.getItem('token') }
                        })
                        .done(function() {
                            alertify.success('Операция успешно завершена');
                            _this.init();
                        })
                        .fail(function() {
                            alertify.error('Ошибка операции');
                        });
                    } else {
                        alertify.error('Введена некорректная сумма');
                    }

                }, function(ev) {
                    ev.preventDefault();

                    alertify.error('Операция отменена');
                }
            );
    }
}));

});
