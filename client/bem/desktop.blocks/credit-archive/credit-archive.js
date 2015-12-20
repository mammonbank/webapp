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
        BEMDOM.append(this.domElem, BEMHTML.apply({
            block: 'credit-archive',
            elem: 'item',
            content: [
                {
                    elem: 'sum',
                    content: e.outstandingLoan + ' / ' + e.sum
                },
                {
                    elem: 'date',
                    content: [
                        {
                            elem: 'start',
                            content: 'Дата взятия кредита: ' + e.startDate
                        },
                        {
                            elem: 'end',
                            content: 'Дата окончания кредита: ' + e.startDate
                        }
                    ]
                },
                {
                    elem: 'type',
                    content: e.repaymentType
                },
                {
                    elem: 'credit-type',
                    content: data.title
                }
            ]
        }));
    }
}));

});
