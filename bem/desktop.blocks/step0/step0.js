modules.define('step0', ['i-bem__dom', 'jquery'], function(provide, BEMDOM, $) {

provide(BEMDOM.decl('step0', {

    onSetMod : {
        'js': function() {
            this.buttons = this.findBlocksInside('button');

            this.buttons[0].on('click', this.onCancel.bind(this));
            this.buttons[1].on('click', this.onSubmit.bind(this));
        }
    },

    onSubmit: function() {
        this.setMod('hide');
        this.findBlockOutside('page').findBlockInside('reg-form').delMod('hide');
    },

    onCancel: function() {
        window.location.href = '/';
    }
}));

});
