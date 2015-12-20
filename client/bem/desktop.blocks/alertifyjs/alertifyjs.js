modules.define(
    'alertifyjs',
    ['loader_type_js'],
    function(provide, loader) {

        loader('/alertifyjs/dist/js/alertify.js',
            function() { provide(); });
});
