modules.define('credit-active', ['i-bem__dom', 'jquery', 'BEMHTML', 'alertifyjs', 'validator'], function(provide, BEMDOM, $, BEMHTML) {

provide(BEMDOM.decl('credit-active', {
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
            url: BEMDOM.url + 'api/client/'+this.clientId+'/credits',
            method: 'GET',
            headers: { 'Authorization': this.token }
        })
        .done(this.onDone.bind(this));
    },

    onDone: function(data) {
        if (data.credits.length === 0) {
            BEMDOM.append(this.domElem, BEMHTML.apply({
                block: 'info',
                content: 'Ни одного кредита не найдено.'
            }));
            return;
        }

        $.each(data.credits, this.addElem.bind(this));
    },

    addElem: function(i, e) {
        $.ajax({
            url: BEMDOM.url + 'api/credit/types/' + e.credit_type_id,
            method: 'GET',
            headers: { 'Authorization': this.token }
        })
        .done(this.onGetType.bind(this, e));
    },

    onGetType: function(e, data) {
        var t = new Date(),
            t2 = new Date();
        t.setTime(Date.parse(e.startDate));
        t2.setTime(Date.parse(e.endDate));

        BEMDOM.append(this.domElem, BEMHTML.apply({
            block: 'credit-active',
            elem: 'item',
            mix: {
                block: 'credit-act-item',
                mods: { id: e.id }
            },
            content: [
                {
                    elem: 'date',
                    content: [
                        {
                            elem: 'start',
                            content: 'Дата взятия кредита: ' + t.toLocaleString()
                        },
                        {
                            elem: 'end',
                            content: 'Дата окончания кредита: ' + t2.toLocaleString()
                        }
                    ]
                },
                {
                    elem: 'credit-type',
                    content: 'Тип кредита: ' + data.title
                },
                {
                    elem: 'type',
                    content: 'Тип выплат: ' + e.repaymentType
                },
                {
                    elem: 'sum',
                    content: 'Сумма кредита: ' + e.sum + ' BYR'
                },
                {
                    elem: 'out',
                    content: 'Осталось погасить: ' + e.outstandingLoan + ' BYR'
                }
            ]
        }));

        var item = this.findBlockInside({ block: 'credit-act-item', modName: 'id', modVal: e.id }),
            btn = item.findBlockInside('button');

        btn.on('click', this.onClick.bind(this, e.id));
    },

    onClick: function(id) {
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
                            url: BEMDOM.url + 'api/credits/'+localStorage.getItem('clientId')+'/deposit',
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
