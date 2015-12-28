modules.define('credit-all', ['i-bem__dom', 'jquery', 'BEMHTML'], function(provide, BEMDOM, $, BEMHTML) {

provide(BEMDOM.decl('credit-all', {
    onSetMod: {
        'js': function() {
            alertify.logPosition("bottom right");
            $.ajax({
                url: BEMDOM.url + 'api/client/' + localStorage.getItem('clientId') + '/credit/applications',
                method: 'GET',
                headers: { 'Authorization': localStorage.getItem('token') }
            })
            .done(this.onDone.bind(this))
            .fail(this.onFail.bind(this));
        }
    },

    onDone: function(data) {
        this.domElem.html('');
        if (data.creditApps.length === 0) {
            BEMDOM.append(this.domElem, BEMHTML.apply({
                block: 'info',
                content: 'Ни одной заявки не найдено.'
            }));
            return;
        }

        $.each(data.creditApps, this.addApp.bind(this));
    },

    addApp: function(i, e) {
        var t = new Date();
        t.setTime(Date.parse(e.created_at));

        BEMDOM.append(this.domElem, BEMHTML.apply({
            block: 'application',
            js: true,
            content: [
                {
                    elem: 'date',
                    content: 'Дата подачи заявки: ' + t.toLocaleString()
                },
                {
                    elem: 'sum',
                    content: 'Запрошенная сумма: ' + e.plannedSum + ' BYR'
                },
                {
                    elem: 'term',
                    content: 'Срок погашения: ' + e.plannedTerm + ' мес.'
                },
                {
                    elem: 'confirm',
                    content: e.isConfirmed ? 'Одобрено' : 'Обрабатывается'
                }
            ]
        }));
    },

    onFail: function(data) {

    }
}));

});
