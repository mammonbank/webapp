modules.define('board', ['i-bem__dom', 'jquery', 'BEMHTML'], function(provide, BEMDOM, $, BEMHTML) {

provide(BEMDOM.decl('board', {
    onSetMod: {
        'js': function() {
            $.ajax({
                url: BEMDOM.url + 'api/client/accounts/' + localStorage.getItem('clientId'),
                method: 'GET'
            })
            .done(this.onDone.bind(this));
        }
    },

    onDone: function(data) {
        this.elem('account').html('У вас на счету: ' + data.clientAccount.amount + ' бел. руб.');
    }
}));

});
