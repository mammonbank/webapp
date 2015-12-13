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
        $.post(BEMDOM.url + 'auth/client/step-2', {
            clientId: this.params.clientId,
            oneTimePassword: this.input.getVal()
        }, this.onSuccess, this.onFail.bind(this));
    },

    onSuccess: function(data) {
        localStorage.setItem('token', data.token);
        window.location.href = '/dashboard';
    },

    onFail: function(data) {
        console.log('fail', data);
    }
}));

});
