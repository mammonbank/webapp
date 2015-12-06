modules.define('step0', ['i-bem__dom', 'jquery'], function(provide, BEMDOM, $) {

provide(BEMDOM.decl('step0', {

    onSetMod : {
        'js': function() {
            this.button = this.findBlockInside('button');

            this.button.on('click', this.onSubmit.bind(this));
        }
    },

    onSubmit: function() {
        this.setMod('hide');
        this.findBlockOutside('page').findBlockInside('reg-form').delMod('hide');
    }
}));

});
