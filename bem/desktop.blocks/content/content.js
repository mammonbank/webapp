modules.define('content', ['i-bem__dom', 'jquery'], function(provide, BEMDOM, $) {

provide(BEMDOM.decl('content', {
    onSetMod: {
        'js': function() {

        },
        'credit': {
            'new': function() {
                this.creditNew = this.findBlockInside('credit-new');
                this.creditNew.setMod('show', 'yes');
            },
            'all': function() {
                this.creditNew = this.findBlockInside('credit-new');
                this.creditNew.delMod('show');
                console.log('all');
            }
        }
    }
}));

});
