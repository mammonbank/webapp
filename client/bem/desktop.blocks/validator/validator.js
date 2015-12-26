modules.define(
    'validator',
    ['loader_type_js'],
    function(provide, loader) {

        loader('/libs/validate.js/validate.min.js',
            function() { provide(); });
});
