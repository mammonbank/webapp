modules.define('deposit-all', ['i-bem__dom', 'jquery', 'BEMHTML', 'alertifyjs'], function(provide, BEMDOM, $, BEMHTML) {

provide(BEMDOM.decl('deposit-all', {
    onSetMod: {
        'js': function() {
            alertify.logPosition("bottom right");

            $.ajax({
                url: BEMDOM.url + 'api/client/' + localStorage.getItem('clientId') + '/deposit/applications',
                method: 'GET',
                headers: { 'Authorization': localStorage.getItem('token') }
            })
            .done(this.onDone.bind(this))
            .fail(this.onFail.bind(this));
        }
    },

    onDone: function(data) {
        this.domElem.html('');
        if (data.depositApps.length === 0) {
            BEMDOM.append(this.domElem, BEMHTML.apply({
                block: 'info',
                content: 'Ни одной заявки не найдено.'
            }));
            return;
        }

        $.each(data.depositApps, this.addApp.bind(this));
    },

    addApp: function(i, e) {
        $.ajax({
            url: BEMDOM.url + 'api/deposit/types/' + e.deposit_type_id,
            method: 'GET',
            headers: { 'Authorization': localStorage.getItem('token') }
        })
        .done(this.onTypeDone.bind(this, e))
        .fail(this.onFail.bind(this));
    },

    onTypeDone: function(e, data) {
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
                    content: 'Первоначальная сумма: ' + e.plannedSum + ' бел. руб.'
                },
                {
                    elem: 'term',
                    content: 'Тип депозита: ' + data.title
                },
                {
                    elem: 'confirm',
                    content: e.isConfirmed ? 'Одобрено' : 'Обрабатывается'
                }
            ]
        }));
    },

    onFail: function(data) {
        alertify.error('Ошибка получения депозитов');
    }
}));
});
