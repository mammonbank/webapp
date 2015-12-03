define([
    'jquery',
    'underscore',
    'backbone',
    'routes/router'
    ], function($, _, Backbone, Router) {
    var app = {
        router: new Router(),
        proxy: _.extend({}, Backbone.Events)
    };

    return app;
});
