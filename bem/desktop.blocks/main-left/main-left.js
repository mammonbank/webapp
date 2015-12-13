modules.define('main-left', ['i-bem__dom', 'jquery'], function(provide, BEMDOM, $) {

provide(BEMDOM.decl('main-left', {
    onSetMod: {
        'js': function() {
            this.page = this.findBlockOutside('page');
            this.content = this.page.findBlockInside('content');

            this.bindTo('credit_new', 'click', this.onCreditNew.bind(this));
            this.bindTo('credit_all', 'click', this.onCreditAll.bind(this));
        }
    },

    onCreditNew: function() {
        this.content.setMod('credit', 'new');
    },

    onCreditAll: function() {
        this.content.setMod('credit', 'all');
    }
}));

});
