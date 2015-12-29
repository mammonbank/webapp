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
            url: BEMDOM.url + 'api/deposit/types/' + e.deposit_type_id,
            method: 'GET',
            headers: { 'Authorization': this.token }
        })
        .done(this.onGetType.bind(this, e));
    },

    onGetType: function(e, data) {
        var t = new Date(),
            t2 = new Date();
        t.setTime(Date.parse(e.startDate));
        t2.setTime(Date.parse(e.deleted_at));

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
                    content: 'Дата создания депозита: ' + t.toLocaleString()
                },
                {
                    elem: 'field',
                    content: 'Дата окончания депозита: ' + t2.toLocaleString()
                },
                {
                    elem: 'field',
                    content: 'Название типа депозита' + data.title
                },
                {
                    elem: 'field',
                    content: 'Процентная ставка по депозиту: ' + data.interest * 100 + '%'
                }
            ]
        }));
    }
}));
});
