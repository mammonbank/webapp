modules.define('qr', ['i-bem__dom', 'jquery', 'keyboard__codes', 'alertifyjs'], function(provide, BEMDOM, $, keyCodes) {

provide(BEMDOM.decl('qr', {

    onSetMod: {
        'js': function() {
            this.button = this.findBlockInside('button');
            this.input = this.findBlockInside('input');

            this.button.on('click', this.onSubmit.bind(this));
        },
        'show': {
            'yes': function() {
                this.bindTo('keydown', this._onKeyDown);
            }
        }
    },

    onSubmit: function() {
        $.ajax({
            url: BEMDOM.url + 'auth/client/step-2',
            method: 'POST',
            data: {
                clientId: this.params.clientId,
                oneTimePassword: this.input.getVal()
            }
        })
        .done(this.onSuccess.bind(this))
        .fail(this.onFail.bind(this));
    },

    onSuccess: function(data) {
        this.unbindFrom('keydown', this._onKeyDown);

        localStorage.setItem('token', data.token);
        localStorage.setItem('clientId', this.params.clientId);
        window.location.href = '/dashboard';
    },

    onFail: function(data) {
        alertify.error('Неверный код');
        console.log('fail', data);
    }
}));

});
