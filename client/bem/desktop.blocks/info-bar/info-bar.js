modules.define('info-bar', ['i-bem__dom', 'jquery'], function(provide, BEMDOM, $) {

provide(BEMDOM.decl('info-bar', {

    onSetMod: {
        'js': function() {
            this.init();
        },
        'reload': function() {
            this.init();
        }
    },

    init: function() {
        this.clientId = localStorage.getItem('clientId');
        this.token = localStorage.getItem('token');

        if (this.clientId && this.token) {
            this.getInfo();
        }

    },

    getInfo: function() {
        $.ajax({
            url: BEMDOM.url + 'api/client/accounts/' + this.clientId,
            method: 'GET',
            headers: { 'Authorization': this.token }
        })
        .done(this.onAccountSuccess.bind(this))
        .fail(this.onFail.bind(this));
    },

    onAccountSuccess: function(data) {
        if (data.message) {
            this.onFail();
            return;
        }

        $.ajax({
            url: BEMDOM.url + 'api/clients/' + this.clientId,
            method: 'GET',
            headers: { 'Authorization': this.token }
        })
        .done(this.onInfoSuccess.bind(this))
        .fail(this.onInfoFail.bind(this));

        var page = this.findBlockOutside('page');
        this.spin = page.findBlockInside('spin');
        this.spin.delMod('visible');
        page.findBlockInside('main-left').delMod('hide');
        page.findBlockInside('main-right').delMod('hide');
    },

    onFail: function(data) {
        localStorage.removeItem('clientId');
        localStorage.removeItem('token');
        // to do modal and redirect
        window.location.href = '/';
    },

    onInfoSuccess: function(data) {
        var stat = data.isConfirmed ? 'Подтвержденный' : 'Ожидает проверки';
        this.elem('name')
            .html('Здравствуйте, ' + data.lastName + ' ' + data.firstName + ' ' + data.patronymic);
        this.elem('status').html('<b>Статус аккаунта:</b> ' + stat);
    },

    onInfoFail: function(data) {
        // todo modal
    }

}));

});
