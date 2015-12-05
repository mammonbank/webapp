modules.define('header', ['i-bem__dom'], function(provide, BEMDOM) {

provide(BEMDOM.decl('header', {

    onSetMod: {
        'js': function() {
            BEMDOM.url = '//localhost:3000/';
        }
    }
}));

});
