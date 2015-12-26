modules.define(
    'alertifyjs',
    ['loader_type_js'],
    function(provide, loader) {

        loader('/libs/alertifyjs/dist/js/alertify.js',
            function() { provide(); });
});
