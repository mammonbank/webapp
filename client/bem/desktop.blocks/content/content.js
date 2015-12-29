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
        },
        'deposit': {
            'new': function() {
                this._clear();
                BEMDOM.append(this.domElem, BEMHTML.apply({
                    block: 'deposit-new',
                    js: true,
                    content: []
                }));
            },
            'all': function() {
                this._clear();
                BEMDOM.append(this.domElem, BEMHTML.apply({
                    block: 'deposit-all',
                    js: true,
                    content: []
                }));
            },
            'active': function() {
                this._clear();
                BEMDOM.append(this.domElem, BEMHTML.apply({
                    block: 'deposit-active',
                    js: true,
                    content: []
                }));
            },
            'archive': function() {
                this._clear();
                BEMDOM.append(this.domElem, BEMHTML.apply({
                    block: 'deposit-archive',
                    js: true,
                    content: []
                }));
            }
        },
        'settings': {
            'yes': function() {
                this._clear();
                BEMDOM.append(this.domElem, BEMHTML.apply({
                    block: 'settings',
                    js: true,
                    content: []
                }));
            }
        },
        'reset': {
            'yes': function() {
                this._clear();
                BEMDOM.append(this.domElem, BEMHTML.apply({
                    block: 'reset',
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
                },
                {
                    block: 'button',
                    mix: { block: 'board', elem: 'withdraw' },
                    mods: { theme: 'islands', size: 's', type: 'submit', view: 'action', id: 'withdraw', disabled: true },
                    text: 'Снять деньги со счета'
                },
                {
                    block: 'button',
                    mix: { block: 'board', elem: 'deposit' },
                    mods: { theme: 'islands', size: 's', type: 'submit', view: 'action', id: 'deposit', disabled: true },
                    text: 'Положить деньги на счет'
                }
            ]
        }));
    }
}));

});
