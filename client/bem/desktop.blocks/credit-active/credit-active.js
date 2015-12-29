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
        this.domElem.html('');

        if (data.credits.length === 0) {
            BEMDOM.append(this.domElem, BEMHTML.apply({
                block: 'info',
                content: 'Ни одного кредита не найдено.'
            }));
            return;
        }

        $.each(data.credits, this.addElem.bind(this));
        var page = this.findBlockOutside('page'),
            content = page && page.findBlockInside('content');
        if (content) {
            if (content.hasMod('credit', 'active')) {
                setTimeout(this.init.bind(this), 5000);
            }
        }
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
                    content: 'Тип выплат: ' + e.repaymentType === 'DIFF' ? 'Дифференцированный' : 'Аннуитетный'
                },
                {
                    elem: 'sum',
                    content: 'Сумма кредита: ' + e.sum + ' BYR'
                },
                {
                    elem: 'out',
                    content: 'Осталось погасить: ' + e.outstandingLoan + ' BYR'
                },
                {
                    elem: 'loan',
                    content: 'Задолжность: ' + e.overdueSum + ' BYR'
                }
            ]
        }));
    }
}));

});
