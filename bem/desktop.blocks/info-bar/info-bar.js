modules.define('info-bar', ['i-bem__dom', 'jquery'], function(provide, BEMDOM, $) {

provide(BEMDOM.decl('info-bar', {

    onSetMod: {
        'js': function() {
            this.clientId = localStorage.getItem('clientId');
            this.token = localStorage.getItem('token');

            if (this.clientId && this.token) {
                this.getInfo();
            }
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
        this.spin = this.findBlockOutside('page').findBlockInside('spin');
        this.spin.delMod('visible');
        console.log('info', data);
    },

    onInfoSuccess: function(data) {
        console.log(data);
    }

}));

});
