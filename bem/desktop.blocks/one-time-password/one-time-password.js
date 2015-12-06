modules.define('one-time-password', ['i-bem__dom', 'jquery'], function(provide, BEMDOM, $) {

provide(BEMDOM.decl('one-time-password', {

    onSetMod: {
        'js': function() {
            this.pwd = this.findBlockInside('input');
            this.button = this.findBlockInside('button');

            this.button.on('click', this.onSubmit.bind(this));
        }
    },

    onSubmit: function() {
        $.ajax({
            url: '//localhost:3000/auth/client/step-2',
            method: 'POST',
            data: { clientId: localStorage.getItem('clientId'), oneTimePassword: this.pwd.getVal() }
        }).done(this.onSuccess.bind(this));
    },

    onSuccess: function(data) {
        console.log('otp', data);
        if (data.token) {
            localStorage.setItem('token', data.token);
            this.setMod('hide');
            this.findBlockOutside('page').findBlockInside('info-bar').delMod('hide').setMod('reload');
        }
    }
}));

});
