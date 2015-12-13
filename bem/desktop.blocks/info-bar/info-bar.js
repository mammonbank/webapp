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
            url: BEMDOM.url + 'api/client/' + this.clientId + '/account',
            method: 'GET',
            headers: { 'Authorization': this.token }
        }).done(this.onAccountSuccess.bind(this));

        $.ajax({
            url: BEMDOM.url + 'api/clients/' + this.clientId,
            method: 'GET',
            headers: { 'Authorization': this.token }
        }).done(this.onInfoSuccess.bind(this));
    },

    onAccountSuccess: function(data) {
        var page = this.findBlockOutside('page');
        this.spin = page.findBlockInside('spin');
        this.spin.delMod('visible');
        page.findBlockInside('main-left').delMod('hide');
        page.findBlockInside('main-right').delMod('hide');
        console.log('info', data);
    },

    onInfoSuccess: function(data) {
        var stat = data.isConfirmed ? 'Подтвержденный' : 'Ожидает проверки';
        console.log(data);
        this.elem('name')
            .html('<b>Здравствуйте:</b> ' + data.lastName + ' ' + data.firstName + ' ' + data.patronymic);
        this.elem('status').html('<b>Статус аккаунта:</b> ' + stat);
    }

}));

});
