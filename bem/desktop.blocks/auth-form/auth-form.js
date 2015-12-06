modules.define('auth-form', ['i-bem__dom', 'jquery'], function(provide, BEMDOM, $) {

provide(BEMDOM.decl('auth-form', {

    onSetMod: {
        'js': function() {
            this.button = this.findBlockInside('button');
            this.inputs = this.findBlocksInside('input');
            this.idNumber = this.inputs[0];
            this.password = this.inputs[1];
            console.log(this, this.idNumber);

            this.button.on('click', this.onSubmit.bind(this));

            if (!localStorage.getItem('clientId')) {
                this.delMod('hide');
                this.findBlockOutside('page').findBlockInside('spin').delMod('visible');
            }
        }
    },

    onSubmit: function() {
        $.ajax({
            url: '//localhost:3000/auth/client/step-1',
            method: 'POST',
            data: { passportIdNumber: this.idNumber.getVal(), password: this.password.getVal() }
        }).done(this.onSuccess.bind(this));
    },

    onSuccess: function(data) {
        console.log('auth', data);
        if (data.clientId) {
            localStorage.setItem('clientId', data.clientId);
            this.otp = this.findBlockOutside('page').findBlockInside('one-time-password');
            this.otp.delMod('hide');
            this.setMod('hide');
        }
    }
}));

});
