modules.define('header', ['i-bem__dom'], function(provide, BEMDOM) {

provide(BEMDOM.decl('header', {

    onSetMod: {
        'js': function() {
            if (window.location.hostname === 'localhost') {
                BEMDOM.url = '//localhost:3000/';
            } else {
                BEMDOM.url = 'https://api-mammonbank.com/';
            }
        }
    }
}));

});
