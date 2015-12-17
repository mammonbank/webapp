modules.define('type-item', ['i-bem__dom', 'jquery', 'BEMHTML'], function(provide, BEMDOM, $, BEMHTML) {

provide(BEMDOM.decl('type-item', {
    onSetMod: {
        'js': function() {
            this.button = this.findBlockInside('button');

            this.button.on('click', this.onClick.bind(this));
        }
    },

    onClick: function() {
        var creditNew = this.findBlockOutside('credit-new');
        creditNew.elem('type').html('');
        creditNew.setMod(creditNew.elem('type'), 'hide');
        creditNew.elem('finish').html('');
        BEMDOM.append(creditNew.elem('finish'), BEMHTML.apply({
            block: 'credit-finish',
            js: {
                typeId: this.params.typeId,
                maxSum: this.params.maxSum,
                minSum: this.params.minSum,
                interest: this.params.interest,
                term: this.params.term
            },
            content: [
                {
                    elem: 'title',
                    content: this.params.title
                },
                {
                    block: 'group',
                    content: [
                        {
                            elem: 'text',
                            content: 'Согласно типу кредита, сумма может быть в диапазоне:<br>' +
                                this.params.minSum + ' руб. - ' + this.params.maxSum + ' руб.'
                        },
                        {
                            block: 'label',
                            content: 'Сумма кредита:'
                        },
                        {
                            block: 'input',
                            mods: { theme: 'islands', size: 'm', id: 'plannedSum' }
                        }
                    ]
                },
                {
                    block: 'group',
                    content: [
                        {
                            elem: 'text',
                            content: 'Срок на погашение кредита может быть в диапазоне:<br>' +
                                this.params.term[0] + ' - ' + this.params.term[1] + ' месяца(ев)'
                        },
                        {
                            block: 'label',
                            content: 'Срок:'
                        },
                        {
                            block: 'input',
                            mods: { theme: 'islands', size: 'm', id: 'plannedTerm' }
                        }
                    ]
                },
                {
                    block: 'button',
                    mods: { theme: 'islands', size: 'm', type: 'submit', view: 'action' },
                    text: 'Отправить заявку'
                }
            ]
        }));
    }
}));

});
