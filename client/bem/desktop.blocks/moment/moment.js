modules.define(
    'moment',
    ['loader_type_js'],
    function(provide, loader) {

        loader('/moment/min/moment.min.js',
            function() { provide(); });
});
