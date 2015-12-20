modules.define('settings', ['i-bem__dom', 'jquery', 'BEMHTML', 'alertifyjs', 'validator'], function(provide, BEMDOM, $, BEMHTML) {

provide(BEMDOM.decl('settings', {
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
            url: BEMDOM.url + 'api/clients/' + this.clientId,
            method: 'GET',
            headers: { 'Authorization': this.token }
        })
        .done(this.onDone.bind(this))
        .fail(this.onFail.bind(this));
    },

    onDone: function(data) {
        BEMDOM.append(this.domElem, BEMHTML.apply([
            {
                block: 'group',
                content: [
                    {
                        elem: 'line',
                        content: 'Фамилия'
                    },
                    {
                        elem: 'val',
                        content: data.lastName
                    }
                ]
            },
            {
                block: 'group',
                content: [
                    {
                        elem: 'line',
                        content: 'Имя'
                    },
                    {
                        elem: 'val',
                        content: data.firstName
                    }
                ]
            },
            {
                block: 'group',
                content: [
                    {
                        elem: 'line',
                        content: 'Отчество'
                    },
                    {
                        elem: 'val',
                        content: data.patronymic
                    }
                ]
            },
            {
                block: 'group',
                content: [
                    {
                        elem: 'line',
                        content: 'Почта'
                    },
                    {
                        elem: 'val',
                        content: data.email
                    }
                ]
            },
            {
                block: 'group',
                content: [
                    {
                        elem: 'line',
                        content: 'Почта'
                    },
                    {
                        elem: 'val',
                        content: new Date(Date.parse(data.dateOfBirth)).toLocaleString()
                    }
                ]
            },
            {
                block: 'group',
                content: [
                    {
                        elem: 'line',
                        content: 'Телефон'
                    },
                    {
                        elem: 'val',
                        content: data.phoneNumber
                    }
                ]
            },
            {
                block: 'group',
                content: [
                    {
                        elem: 'line',
                        content: 'Номер паспорта'
                    },
                    {
                        elem: 'val',
                        content: data.passportNumber
                    }
                ]
            },
            {
                block: 'group',
                content: [
                    {
                        elem: 'line',
                        content: 'Личный (идентификационный) номер'
                    },
                    {
                        elem: 'val',
                        content: data.passportIdNumber
                    }
                ]
            }
        ]))
    },

    onFail: function() {
        alertify.error('Ошибка получения данных');
    }
}));

});
