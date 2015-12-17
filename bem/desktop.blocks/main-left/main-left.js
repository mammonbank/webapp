modules.define('main-left', ['i-bem__dom', 'jquery'], function(provide, BEMDOM, $) {

provide(BEMDOM.decl('main-left', {
    onSetMod: {
        'js': function() {
            this.page = this.findBlockOutside('page');
            this.content = this.page.findBlockInside('content');

            this.bindTo('main', 'click', this.onMain.bind(this));

            this.bindTo('credit_new', 'click', this.onCreditNew.bind(this));
            this.bindTo('credit_all', 'click', this.onCreditAll.bind(this));
            this.bindTo('credit_active', 'click', this.onCreditActive.bind(this));
            this.bindTo('credit_archive', 'click', this.onCreditArchive.bind(this));
            this.bindTo('credit_pay', 'click', this.onCreditPay.bind(this));

            this.bindTo('deposit_new', 'click', this.onDepositNew.bind(this));
            this.bindTo('deposit_all', 'click', this.onDepositAll.bind(this));
            this.bindTo('deposit_active', 'click', this.onDepositActive.bind(this));
            this.bindTo('deposit_archive', 'click', this.onDepositArchive.bind(this));

            this.bindTo('settings', 'click', this.onSettings.bind(this));
            this.bindTo('reset', 'click', this.onReset.bind(this));
            this.bindTo('help', 'click', this.onHelp.bind(this));

            this.bindTo('logout', 'click', this.onLogout.bind(this));
        }
    },

    onMain: function() {
        this.content.setMod('page', 'main');
    },

    onCreditNew: function() {
        this.content.setMod('credit', 'new');
    },

    onCreditAll: function() {
        this.content.setMod('credit', 'all');
    },

    onCreditActive: function() {
        this.content.setMod('credit', 'active');
    },

    onCreditArchive: function() {
        this.content.setMod('credit', 'archive');
    },

    onCreditPay: function() {
        this.content.setMod('credit', 'pay');
    },

    onDepositNew: function() {
        this.content.setMod('deposit', 'new');
    },

    onDepositAll: function() {
        this.content.setMod('deposit', 'all');
    },

    onDepositActive: function() {
        this.content.setMod('deposit', 'active');
    },

    onDepositArchive: function() {
        this.content.setMod('deposit', 'archive');
    },

    onSettings: function() {
        this.content.setMod('settings', 'yes');
    },

    onReset: function() {
        this.content.setMod('reset', 'yes');
    },

    onHelp: function() {
        this.content.setMod('help', 'yes');
    },

    onLogout: function() {
        localStorage.removeItem('token');
        localStorage.removeItem('clientId');
        window.location.href = '/';
    }
}));

});
