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
        this.domElem.html('');

        if (data.deposits.length === 0) {
            BEMDOM.append(this.domElem, BEMHTML.apply({
                block: 'info',
                content: 'Ни одного депозита не найдено.'
            }));
            return;
        }

        $.each(data.deposits, this.addElem.bind(this));
        if (this.findBlockOutside('content').hasMod('deposit', 'active')) {
            setTimeout(function() {
                this.init.bind(this);
            }.bind(this), 5000);
        }
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
        var e2 = e.endDate ? t2.setTime(Date.parse(e.endDate)) : 'бессрочно';
        var e3 = e.lastInterestDate ? t3.setTime(Date.parse(e.lastInterestDate)) : '-';

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
                            content: 'Дата создания депозита: ' + t.toLocaleString()
                        },
                        {
                            elem: 'end',
                            content: 'Дата окончания депозита: ' + e2.toLocaleString()
                        }
                    ]
                },
                {
                    elem: 'type',
                    content: 'Последнее пополнение: ' + e3.toLocaleString()
                },
                {
                    elem: 'sum',
                    content: 'На счету депозита: ' + e.sum + ' BYR'
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
                        },
                        {
                            block: 'button',
                            mix: { block: 'deposit-active', elem: 'close' },
                            mods: { theme: 'islands', size: 'm', type: 'submit', view: 'action', id: 'close' },
                            text: 'Закрыть'
                        }
                    ]
                }
            ]
        }));
        var btns = this.findBlockInside({ block: 'deposit-btns', modName: 'id', modVal: e.id }),
            withdraw = btns.findBlockInside({ block: 'button', modName: 'id', modVal: 'withdraw' }),
            deposit = btns.findBlockInside({ block: 'button', modName: 'id', modVal: 'deposit' }),
            close = btns.findBlockInside({ block: 'button', modName: 'id', modVal: 'close' });

        withdraw.on('click', this.onWithdraw.bind(this, e.id));
        deposit.on('click', this.onDeposit.bind(this, e.id));
        close.on('click', this.onClose.bind(this, e.id));
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
                        alertify.success('Отправлен запрос на снятие: ' + val + ' BYR');
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

                    alertify.log('Операция отменена');
                }
            );
    },

    onDeposit: function(id) {
        var _this = this;

        alertify
            .defaultValue('100000')
            .prompt('Укажите сумму которую хотите положить',
                function (val, ev) {
                  ev.preventDefault();

                  var valid = validate({sum: val}, { sum: {numericality:{onlyInteger: true}}});

                    if (!valid) {
                        alertify.success('Отправлен запрос на снятие: ' + val + ' BYR');
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

                    alertify.log('Операция отменена');
                }
            );
    },

    onClose: function(id) {
        var _this = this;

        alertify.confirm("Вы действительно хотите закрыть депозит?", function () {
            $.ajax({
                url: BEMDOM.url + 'api/deposits/'+id,
                method: 'DELETE',
                headers: { 'Authorization': localStorage.getItem('token') }
            })
            .done(function() {
                alertify.success('Операция успешно завершена');
                _this.init();
            })
            .fail(function() {
                alertify.error('Ошибка операции');
            });
        }, function() {
            alertify.log('Операция отменена');
        });
    },

    onFail: function() {
        alertify.error('Ошибка получения активных депозитов');
    },

    onGetTypeFail: function() {
        alertify.error('Ошибка получения типа депозита');
    }
}));
});
