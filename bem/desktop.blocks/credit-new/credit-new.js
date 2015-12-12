modules.define('credit-new', ['i-bem__dom', 'jquery'], function(provide, BEMDOM, $) {

provide(BEMDOM.decl('credit-new', {
    onSetMod: {
        'js': function() {

        },
        'show': {
            'yes': function() {
                console.log('none');
            }
        }
    }
}));

});
