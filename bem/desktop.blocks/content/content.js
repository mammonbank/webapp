modules.define('content', ['i-bem__dom', 'jquery', 'BEMHTML'], function(provide, BEMDOM, $, BEMHTML) {

provide(BEMDOM.decl('content', {
    onSetMod: {
        'js': function() {
            this.mainPage();
        },
        'page': {
            'main': function() {
                this.mainPage();
            }
        },
        'credit': {
            'new': function() {
                this.domElem.html('');
                BEMDOM.append(this.domElem, BEMHTML.apply({
                    block: 'credit-new',
                    js: true,
                    content: [
                        {
                            elem: 'category',
                            content: []
                        },
                        {
                            elem: 'type',
                            elemMods: { hide: true },
                            content: []
                        },
                        {
                            elem: 'finish',
                            content: []
                        },
                        {
                            elem: 'result'
                        }
                    ]
                }));
            },
            'all': function() {
                this.domElem.html('');
                BEMDOM.append(this.domElem, BEMHTML.apply({
                    block: 'credit-all',
                    js: true,
                    content: []
                }));
            }
        }
    },

    mainPage: function() {
        this.domElem.html('');
        BEMDOM.append(this.domElem, BEMHTML.apply({
            block: 'board',
            js: true,
            content: [
                {
                    elem: 'account'
                }
            ]
        }));
    }
}));

});
