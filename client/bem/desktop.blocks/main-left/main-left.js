modules.define('main-left', ['i-bem__dom', 'jquery'], function(provide, BEMDOM, $) {

provide(BEMDOM.decl('main-left', {
    onSetMod: {
        'js': function() {
            this.page = this.findBlockOutside('page');
            this.content = this.page.findBlockInside('content');
            this.items = this.findBlocksInside('menu-item');
            $.each(this.items, function(i, e) {
                e.on('click', this.onElemSelect.bind(this, e));
            }.bind(this));

            this.bindTo('main', 'click', this.onMain.bind(this));

            this.bindTo('settings', 'click', this.onSettings.bind(this));
            this.bindTo('reset', 'click', this.onReset.bind(this));

            this.bindTo('logout', 'click', this.onLogout.bind(this));
        },
        'user': {
            'inactive': function() {
                var blocks = this.findBlocksInside({ block: 'menu-item', modName: 'user', modVal: 'forActive' });

                $.each(blocks, function(i, e) {
                    e.setMod('disabled');
                }.bind(this));
            },
            'active': function() {
                this.bindTo('credit_new', 'click', this.onCreditNew.bind(this));
                this.bindTo('credit_all', 'click', this.onCreditAll.bind(this));
                this.bindTo('credit_active', 'click', this.onCreditActive.bind(this));
                this.bindTo('credit_archive', 'click', this.onCreditArchive.bind(this));

                this.bindTo('deposit_new', 'click', this.onDepositNew.bind(this));
                this.bindTo('deposit_all', 'click', this.onDepositAll.bind(this));
                this.bindTo('deposit_active', 'click', this.onDepositActive.bind(this));
                this.bindTo('deposit_archive', 'click', this.onDepositArchive.bind(this));
            }
        }
    },

    onElemSelect: function(e) {
        var menu = this.findBlockInside({ block: 'menu-item', modName: 'active', modVal: 'yes' });
        if (menu)
            menu.delMod('active');

        e.setMod('active', 'yes');
    },

    _clear: function() {
        this.content.delMod('credit');
        this.content.delMod('deposit');
        this.content.delMod('page');
        this.content.delMod('settings');
        this.content.delMod('reset');
    },

    onMain: function() {
        this._clear();
        this.content.setMod('page', 'main');
    },

    onCreditNew: function() {
        this._clear();
        this.content.setMod('credit', 'new');
    },

    onCreditAll: function() {
        this._clear();
        this.content.setMod('credit', 'all');
    },

    onCreditActive: function() {
        this._clear();
        this.content.setMod('credit', 'active');
    },

    onCreditArchive: function() {
        this._clear();
        this.content.setMod('credit', 'archive');
    },

    onDepositNew: function() {
        this._clear();
        this.content.setMod('deposit', 'new');
    },

    onDepositAll: function() {
        this._clear();
        this.content.setMod('deposit', 'all');
    },

    onDepositActive: function() {
        this._clear();
        this.content.setMod('deposit', 'active');
    },

    onDepositArchive: function() {
        this._clear();
        this.content.setMod('deposit', 'archive');
    },

    onSettings: function() {
        this._clear();
        this.content.setMod('settings', 'yes');
    },

    onReset: function() {
        this._clear();
        this.content.setMod('reset', 'yes');
    },

    onLogout: function() {
        localStorage.removeItem('token');
        localStorage.removeItem('clientId');
        window.location.href = '/';
    }
}));

});
