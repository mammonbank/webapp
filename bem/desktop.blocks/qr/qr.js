modules.define('qr', ['i-bem__dom', 'jquery'], function(provide, BEMDOM, $) {

provide(BEMDOM.decl('qr', {

    onSetMod: {
        'js': function() {
            this.button = this.findBlockInside('button');
            this.input = this.findBlockInside('input');

            this.button.on('click', this.onSubmit.bind(this));
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
        localStorage.setItem('token', data.token);
        localStorage.setItem('clientId', this.params.clientId);
        window.location.href = '/dashboard';
    },

    onFail: function(data) {
        console.log('fail', data);
    }
}));

});
