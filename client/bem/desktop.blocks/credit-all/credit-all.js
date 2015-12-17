modules.define('credit-all', ['i-bem__dom', 'jquery', 'BEMHTML'], function(provide, BEMDOM, $, BEMHTML) {

provide(BEMDOM.decl('credit-all', {
    onSetMod: {
        'js': function() {
            $.ajax({
                url: BEMDOM.url + 'api/client/' + localStorage.getItem('clientId') + '/credit/applications',
                method: 'GET'
            })
            .done(this.onDone.bind(this))
            .fail(this.onFail.bind(this));
        }
    },

    onDone: function(data) {
        console.log(data);
        this.domElem.html('');
        $.each(data.creditApps, this.addApp.bind(this));
    },

    addApp: function(i, e) {
        BEMDOM.append(this.domElem, BEMHTML.apply({
            block: 'application',
            js: true,
            content: [
                {
                    elem: 'date',
                    content: 'Дата подачи заявки: ' + e.created_at
                },
                {
                    elem: 'sum',
                    content: 'Запрошенная сумма: ' + e.plannedSum + ' бел. руб.'
                },
                {
                    elem: 'term',
                    content: 'Срок погашения: ' + e.plannedTerm
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
