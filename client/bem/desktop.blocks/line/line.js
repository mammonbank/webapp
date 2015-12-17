modules.define('line', ['i-bem__dom', 'jquery', 'BEMHTML'], function(provide, BEMDOM, $, BEMHTML) {

provide(BEMDOM.decl('line', {
    onSetMod: {
        'js': function() {
            this.signup = this.findBlockInside({ block: 'button', modName: 'id', modVal: 'signup' });
            this.signin = this.findBlockInside({ block: 'button', modName: 'id', modVal: 'signin' });

            this.signup.on('click', this.onSignupClick.bind(this));
            this.signin.on('click', this.onSigninClick.bind(this));
        }
    },

    onSignupClick: function() {
        window.location.href = '/signup';
    },

    onSigninClick: function() {
        window.location.href = '/dashboard';
    }
}));

});
