define([
    'jquery',
    'underscore',
    'backbone',
    'views/signup'
    ], function($, _, Backbone, SignupView) {
    var Router = Backbone.Router.extend({
        routes: {
            '': 'index',
            'signup-:step': 'signup'
        },

        index: function() {
            console.log('index');
        },

        signup: function(step) {
            var signupView = new SignupView();

            signupView.render(step);
        }
    });

    return Router;
});
