modules.define(
    'validator',
    ['loader_type_js'],
    function(provide, loader) {

        loader('//cdnjs.cloudflare.com/ajax/libs/validate.js/0.9.0/validate.min.js',
            function() { provide(); });
});
