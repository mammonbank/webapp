modules.define('deposit-archive', ['i-bem__dom', 'jquery', 'BEMHTML'], function(provide, BEMDOM, $, BEMHTML) {

provide(BEMDOM.decl('deposit-archive', {
    onSetMod: {
        'js': function() {
            this.clientId = localStorage.getItem('clientId');
            this.token = localStorage.getItem('token');
            alertify.logPosition("bottom right");

            $.ajax({
                url: BEMDOM.url + 'api/client/'+this.clientId+'/archives/deposits',
                method: 'GET',
                headers: { 'Authorization': this.token }
            })
            .done(this.onDone.bind(this));
        }
    },

    onDone: function(data) {
        if (data.deposits.length === 0) {
            BEMDOM.append(this.domElem, BEMHTML.apply({
                block: 'info',
                content: 'В архиве пусто :('
            }));
            return;
        }

        $.each(data.deposits, this.addElem.bind(this));
    },

    addElem: function(i, e) {
        $.ajax({
            url: BEMDOM.url + 'api/deposit/types/' + e.credit_type_id,
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
        var e2 = e.endDate ? t2.setTime(Date.parse(e.endDate)).toLocaleString() : 'бессрочно';
        var e3 = e.lastInterestDate ? t2.setTime(Date.parse(e.lastInterestDate)).toLocaleString() : '-';

        BEMDOM.append(this.domElem, BEMHTML.apply({
            block: 'deposit-active',
            elem: 'item',
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
                }
            ]
        }));
    }
}));
});
