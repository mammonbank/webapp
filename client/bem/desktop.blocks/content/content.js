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
                this._clear();
                BEMDOM.append(this.domElem, BEMHTML.apply({
                    block: 'credit-new',
                    js: true,
                    content: [
                        {
                            elem: 'text',
                            content: '<h3>Выберите категорию и тип:</h3>'
                        },
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
                this._clear();
                BEMDOM.append(this.domElem, BEMHTML.apply({
                    block: 'credit-all',
                    js: true,
                    content: []
                }));
            },
            'active': function() {
                this._clear();
                BEMDOM.append(this.domElem, BEMHTML.apply({
                    block: 'credit-active',
                    js: true,
                    content: []
                }));
            },
            'archive': function() {
                this._clear();
                BEMDOM.append(this.domElem, BEMHTML.apply({
                    block: 'credit-archive',
                    js: true,
                    content: []
                }));
            },
            'pay': function() {
                this._clear();
                BEMDOM.append(this.domElem, BEMHTML.apply({
                    block: 'credit-pay',
                    js: true,
                    content: []
                }));
            }
        }
    },

    _clear: function() {
        this.domElem.html('');
    },

    mainPage: function() {
        this._clear();
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
