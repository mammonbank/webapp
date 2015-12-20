modules.define('reset', ['i-bem__dom', 'jquery', 'BEMHTML', 'alertifyjs', 'validator'], function(provide, BEMDOM, $, BEMHTML) {

provide(BEMDOM.decl('reset', {
    onSetMod: {
        'js': function() {
            this.clientId = localStorage.getItem('clientId');
            this.token = localStorage.getItem('token');
            alertify.logPosition("bottom right");

            BEMDOM.append(this.domElem, BEMHTML.apply([
                {
                    block: 'group',
                    content: [
                        {
                            elem: 'line',
                            content: 'Введите новый пароль: '
                        },
                        {
                            block: 'input',
                            mods: { theme: 'islands', type: 'password', size: 'm' }
                        }
                    ]
                },
                {
                    block: 'button',
                    mods: { theme: 'islands', size: 'm', type: 'submit', view: 'action' },
                    text: 'Изменить'
                }
            ]));

            var button = this.findBlockInside('button');
            button.on('click', this.onClick.bind(this));
        }
    },

    onClick: function() {
        var pass = this.findBlockInside('input').getVal(),
            isValid = validate({password: pass}, { password: {
                presence: true,
                format: {
                    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[а-яА-ЯёЁa-zA-Z\d]{8,}$/,
                    message: "^Пароль должен содержать хотя бы одну цифру и заглавную букву"
                },
                length: {
                    minimum: 8,
                    message: "^Пароль должен быть не короче 8 символов"
                }
            }});

        if (isValid) {
            alertify.error('Пароль должен содержать хотя бы одну цифру и заглавную букву')
            return;
        }

        $.ajax({
            url: BEMDOM.url + 'api/clients/' + this.clientId,
            method: 'PATCH',
            headers: { 'Authorization': this.token }
        })
        .done(this.onDone.bind(this))
        .fail(this.onFail.bind(this));
    },

    onDone: function() {
        alertify.success('Пароль успешно изменен.');
        alertify.log('Переадресация на главную');
        setTimeout(function() {
            this.findBlockOutside('content').delMod('reset').setMod('page', 'main');
        }.bind(this), 1500);
    },

    onFail: function() {
        alertify.error('Ошибка смены пароля.');
    }
}));

});
