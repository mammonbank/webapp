require.config({
    paths: {
        jquery: '../libs/jquery/dist/jquery',
        underscore: '../libs/underscore/underscore',
        backbone: '../libs/backbone/backbone'
    }
});

require([
    'app'
    ], function(app) {
    /*
        Instantiate all non-dynamic views
    */
    $(document).ready(function() {
    });

    // Start Backbone history a necessary step for bookmarkable URL's
    Backbone.history.start();
});
