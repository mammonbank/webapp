modules.define('deposit-active', ['i-bem__dom', 'jquery', 'BEMHTML', 'alertifyjs', 'validator'], function(provide, BEMDOM, $, BEMHTML) {

provide(BEMDOM.decl('deposit-active', {
    onSetMod: {
        'js': function() {
            this.clientId = localStorage.getItem('clientId');
            this.token = localStorage.getItem('token');
            alertify.logPosition("bottom right");

            this.init();
        }
    },

    init: function() {
        $.ajax({
            url: BEMDOM.url + 'api/client/'+this.clientId+'/deposits',
            method: 'GET',
            headers: { 'Authorization': this.token }
        })
        .done(this.onDone.bind(this))
        .fail(this.onFail.bind(this));
    },

    onDone: function(data) {
        if (data.deposits.length === 0) {
            BEMDOM.append(this.domElem, BEMHTML.apply({
                block: 'info',
                content: 'Ни одного депозита не найдено.'
            }));
            return;
        }

        $.each(data.deposits, this.addElem.bind(this));
    },

    addElem: function(i, e) {
        $.ajax({
            url: BEMDOM.url + 'api/deposit/types/' + e.deposit_type_id,
            method: 'GET',
            headers: { 'Authorization': this.token }
        })
        .done(this.onGetType.bind(this, e))
        .fail(this.onGetTypeFail.bind(this));
    },

    onGetType: function(e, data) {
        var t = new Date(),
            t2 = new Date(),
            t3 = new Date();
        t.setTime(Date.parse(e.startDate));
        var e2 = e.endDate ? t2.setTime(Date.parse(e.endDate)).toLocaleString() : 'бессрочно';
        var e3 = e.lastInterestDate ? t2.setTime(Date.parse(e.lastInterestDate)).toLocaleString() : '-';

        BEMDOM.append(this.domElem, BEMHTML.apply({
            block: 'deposit-active',
            elem: 'item',
            mix: {
                block: 'deposit-btns',
                mods: { id: e.id }
            },
            content: [
                {
                    elem: 'date',
                    content: [
                        {
                            elem: 'start',
                            content: 'Дата создания депозита: ' + t
                        },
                        {
                            elem: 'end',
                            content: 'Дата окончания депозита: ' + e2
                        }
                    ]
                },
                {
                    elem: 'type',
                    content: 'Последнее пополнение: ' + e3
                },
                {
                    elem: 'sum',
                    content: 'На счету депозита: ' + e.sum + ' бел. руб.'
                },
                {
                    elem: 'operations',
                    content: [
                        {
                            block: 'button',
                            mix: { block: 'deposit-active', elem: 'withdraw' },
                            mods: { theme: 'islands', size: 'm', type: 'submit', view: 'action', id: 'withdraw' },
                            text: 'Снять'
                        },
                        {
                            block: 'button',
                            mix: { block: 'deposit-active', elem: 'deposit' },
                            mods: { theme: 'islands', size: 'm', type: 'submit', view: 'action', id: 'deposit' },
                            text: 'Положить'
                        }
                    ]
                }
            ]
        }));
        var btns = this.findBlockInside({ block: 'deposit-btns', modName: 'id', modVal: e.id }),
            withdraw = btns.findBlockInside({ block: 'button', modName: 'id', modVal: 'withdraw' }),
            deposit = btns.findBlockInside({ block: 'button', modName: 'id', modVal: 'deposit' });

        withdraw.on('click', this.onWithdraw.bind(this, e.id));
        deposit.on('click', this.onDeposit.bind(this, e.id));
    },

    onWithdraw: function(id) {
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
                            url: BEMDOM.url + 'api/deposits/'+localStorage.getItem('clientId')+'/withdraw/'+id,
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

    onDeposit: function(id) {
        alertify
            .defaultValue('100000')
            .prompt('Укажите сумму которую хотите положить',
                function (val, ev) {
                  ev.preventDefault();

                  var valid = validate({sum: val}, { sum: {numericality:{onlyInteger: true}}});

                    if (!valid) {
                        alertify.success('Отправлен запрос на снятие: ' + val + ' бел. руб.');
                        $.ajax({
                            url: BEMDOM.url + 'api/deposits/'+localStorage.getItem('clientId')+'/deposit/'+id,
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

    onFail: function() {
        alertify.error('Ошибка получения активных депозитов');
    },

    onGetTypeFail: function() {
        alertify.error('Ошибка получения типа депозита');
    }
}));
});
