modules.define('auth-form', ['i-bem__dom', 'jquery'], function(provide, BEMDOM, $) {

provide(BEMDOM.decl('auth-form', {

    onSetMod: {
        'js': function() {
            this.button = this.findBlockInside('button');
            this.idNumber = this.findBlockInside({ block: 'input', modName: 'id', modVal: 'idNumber' });
            this.password = this.findBlockInside({ block: 'input', modName: 'id', modVal: 'password' });
            this.modal = this.findBlockInside('modal');

            this.token = localStorage.getItem('token');
            this.clientId = localStorage.getItem('clientId');

            this.button.on('click', this.onSubmit.bind(this));

            if (!this.clientId || !this.token) {
                this.delMod('hide');
                this.findBlockOutside('page').findBlockInside('spin').delMod('visible');
            }
        }
    },

    onSubmit: function() {
        $.ajax({
            url: BEMDOM.url + 'auth/client/step-1',
            method: 'POST',
            data: { passportIdNumber: this.idNumber.getVal(), password: this.password.getVal() },
            headers: { 'Authorization': this.token }
        })
        .done(this.onSuccess.bind(this))
        .fail(this.onFail.bind(this));
    },

    onSuccess: function(data) {
        console.log('auth', data);
        if (data.clientId) {
            localStorage.setItem('clientId', data.clientId);
            this.otp = this.findBlockOutside('page').findBlockInside('one-time-password');
            this.otp.delMod('hide');
            this.setMod('hide');
        }
    },

    onFail: function(data) {
        console.log('fail', data);
        this.modal
            .setContent('<h3>Ошибка авторизации</h3> Идентификационный номер или пароль неправильный.')
            .setMod('visible', true);
    }
}));

});
