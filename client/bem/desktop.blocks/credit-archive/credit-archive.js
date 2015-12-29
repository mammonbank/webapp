modules.define('credit-archive', ['i-bem__dom', 'jquery', 'BEMHTML', 'alertifyjs', 'validator'], function(provide, BEMDOM, $, BEMHTML) {

provide(BEMDOM.decl('credit-archive', {
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
            url: BEMDOM.url + 'api/client/'+this.clientId+'/archives/credits',
            method: 'GET',
            headers: { 'Authorization': this.token }
        })
        .done(this.onDone.bind(this));
    },

    onDone: function(data) {
        if (data.credits.length === 0) {
            BEMDOM.append(this.domElem, BEMHTML.apply({
                block: 'info',
                content: 'В архиве пусто :('
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
            t2 = new Date(),
            t3 = new Date();
        t.setTime(Date.parse(e.startDate));
        t2.setTime(Date.parse(e.endDate));
        t3.setTime(Date.parse(e.lastPaymentDate));

        BEMDOM.append(this.domElem, BEMHTML.apply({
            block: 'credit-archive',
            elem: 'item',
            content: [
                {
                    elem: 'field',
                    content: 'Сумма: ' + e.sum + ' BYR'
                },
                {
                    elem: 'field',
                    content: 'Дата создания кредита: ' + t.toLocaleString()
                },
                {
                    elem: 'field',
                    content: 'Дата окончания кредита: ' + t2.toLocaleString()
                },
                {
                    elem: 'field',
                    content: 'Дата последней оплаты кредита: ' + t3.toLocaleString()
                },
                {
                    elem: 'field',
                    content: 'Кол-во платежей: ' + e.numberOfPayments
                },
                {
                    elem: 'field',
                    content: 'Название типа кредита' + data.title
                },
                {
                    elem: 'field',
                    content: 'Тип оплаты: ' + e.repaymentType === 'DIFF' ? 'Дифференцированный' : 'Аннуитетный'
                },
                {
                    elem: 'field',
                    content: 'Процентная ставка: ' + data.interest * 100 + '%'
                }
            ]
        }));
    }
}));

});
