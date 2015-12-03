define([
    'jquery',
    'underscore',
    'backbone'
    ], function($, _, Backbone) {
    var SignupView = Backbone.View.extend({
        tagname: 'div',
        className: 'registerForm',

        render: function(step) {
            var html;

            switch (step) {
                case '1':
                    html = this.step1();
                    break;
                case '2':
                    html = this.step2();
                    break;
                default:
                    html = this.step1();
                    break;
            }
            $('.main').html( this.$el.html( html ) );
            return this;
        },

        step1: function() {
            return this._template('');
        }
    });

    return SignupView;
});
