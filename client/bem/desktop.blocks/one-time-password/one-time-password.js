modules.define('one-time-password',
    ['i-bem__dom', 'jquery', 'keyboard__codes'],
    function(provide, BEMDOM, $, keyCodes) {

provide(BEMDOM.decl('one-time-password', {
    onSetMod: {
        'js': function() {
            this.pwd = this.findBlockInside('input');
            this.button = this.findBlockInside('button');
            this.modal = this.findBlockInside('modal');

            this.token = localStorage.getItem('token');
            this.clientId = localStorage.getItem('clientId');

            this.button.on('click', this.onSubmit.bind(this));
            this.bindTo('keydown', this._onKeyDown);
        }
    },

    _onKeyDown: function(e) {
        if((e.keyCode === keyCodes.ENTER) && !e.shiftKey) {
            this.onSubmit();
        }
    },

    onSubmit: function() {
        $.ajax({
            url: BEMDOM.url + 'auth/client/step-2',
            method: 'POST',
            data: { clientId: localStorage.getItem('clientId'), oneTimePassword: this.pwd.getVal() },
            headers: { 'Authorization': this.token }
        })
        .done(this.onSuccess.bind(this))
        .fail(this.onFail.bind(this));
    },

    onSuccess: function(data) {
        if (data.token) {
            localStorage.setItem('token', data.token);
            this.setMod('hide');

            var page = this.findBlockOutside('page');

            page.findBlockInside('main-left').delMod('hide');
            page.findBlockInside('main-right').delMod('hide');
            page.findBlockInside('info-bar').setMod('reload');
            page.findBlockInside('content').setMod('page', 'main');
        }

        this.unbindFrom('keydown', this._onKeyDown);
    },

    onFail: function(data) {
        console.log('fail', data);
        this.modal.setContent('<h3>Ошибка авторизации</h3> Неправильный код.');
        this.modal.setMod('visible', true);
    }
}));

});
