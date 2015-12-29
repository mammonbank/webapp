modules.define('line', ['i-bem__dom', 'jquery', 'BEMHTML'], function(provide, BEMDOM, $, BEMHTML) {

provide(BEMDOM.decl('line', {
    onSetMod: {
        'js': function() {
            this.credit = this.findBlockInside({ block: 'button', modName: 'id', modVal: 'credit' });
            this.deposit = this.findBlockInside({ block: 'button', modName: 'id', modVal: 'deposit' });

            this.credit.on('click', this.onCreditClick.bind(this));
            this.deposit.on('click', this.onDepositClick.bind(this));
        }
    },

    onCreditClick: function() {
        this.setMod('pressed', 'yes');
        this.setMod(this.elem('credits'), 'show', 'yes');

        this.elem('credits').html('');

        $.ajax({
            url: BEMDOM.url + 'api/credit/categories',
            method: 'GET'
        })
        .done(this.onGetCreditsCats.bind(this));
    },

    onGetCreditsCats: function(data) {
        if (data.creditCats === 0) {
            BEMDOM.append(this.elem('credits'), BEMHTML.apply({
                block: 'some',
                content: 'Категории кредитов не найдены'
            }));
            return;
        }

        BEMDOM.append(this.elem('credits'), BEMHTML.apply({
            block: 'button',
            mix: { block: 'line', elem: 'button' },
            mods: { theme: 'islands', size: 's', type: 'submit', view: 'action', id: 'back' },
            text: 'Вернуться'
        }));
        setTimeout(function() {
            this.findBlockInside({ block: 'button', modName: 'id', modVal: 'back' })
                .on('click', this.onBackClick.bind(this));
        }.bind(this), 500);

        BEMDOM.append(this.elem('credits'), BEMHTML.apply({
            block: 'menu',
            js: true,
            mods: { theme: 'islands', size: 'm' },
            content: []
        }));

        $.each(data.creditCats, this.addCat.bind(this));
    },

    addCat: function(i, e) {
        BEMDOM.append(this.findBlockInside('menu').domElem, BEMHTML.apply({
            block: 'menu-item',
            mods: { theme: 'islands', id: e.id },
            js: true,
            content: e.title
        }));
        setTimeout(function() {
            this.findBlockInside({ block: 'menu-item', modName: 'id', modVal: e.id })
                .on('click', this.onMItemClick.bind(this, e.id));
        }.bind(this), 500);
    },

    onMItemClick: function(id, e) {
        $.ajax({
            url: BEMDOM.url + 'api/credit/categories/'+id+'/credit/types',
            method: 'GET'
        })
        .done(this.onCatChoose.bind(this));
    },

    onCatChoose: function(data) {
        this.elem('credits').html('');

        $.each(data.creditTypes, function(i, e) {
            BEMDOM.append(this.elem('credits'), BEMHTML.apply({
                block: 'line',
                elem: 'item',
                content: [
                    {
                        elem: 'title',
                        content: e.title
                    },
                    {
                        elem: 'description',
                        content: e.description
                    },
                    {
                        elem: 'sum',
                        content: 'Сумма кредита: ' + e.minSum + ' - ' + e.maxSum + ' BYR'
                    },
                    {
                        elem: 'sum',
                        content: 'Срок кредита: ' + e.minTerm + ' - ' + e.maxTerm + ' месяца(ев).'
                    },
                    {
                        block: 'button',
                        mix: { block: 'line', elem: 'calc' },
                        mods: { theme: 'islands', size: 's', type: 'submit', view: 'action', cid: e.id },
                        text: 'Посчитать'
                    }
                ]
            }));
            setTimeout(function() {
                this.findBlockInside({ block: 'button', modName: 'cid', modVal: e.id })
                    .on('click', this.onCalc.bind(this, e));
            }.bind(this), 500);
        }.bind(this));

        BEMDOM.append(this.elem('credits'), BEMHTML.apply({
            block: 'button',
            mix: { block: 'line', elem: 'button' },
            mods: { theme: 'islands', size: 's', type: 'submit', view: 'action', id: 'back' },
            text: 'Вернуться'
        }));
        setTimeout(function() {
            this.findBlockInside({ block: 'button', modName: 'id', modVal: 'back' })
                .on('click', this.onBackClick2.bind(this));
        }.bind(this), 500);
    },

    onDepositClick: function() {
        this.setMod('pressed', 'yes');
        this.setMod(this.elem('deposits'), 'show', 'yes');

        this.elem('deposits').html('');

        $.ajax({
            url: BEMDOM.url + 'api/deposit/types',
            method: 'GET'
        })
        .done(this.onGetDeposits.bind(this));
    },

    onGetDeposits: function(data) {
        if (data.depositTypes === 0) {
            BEMDOM.append(this.elem('deposits'), BEMHTML.apply({
                block: 'some',
                content: 'Типы депозитов не найдены'
            }));
            return;
        }

        this.items = [];
        $.each(data.depositTypes, this.addDep.bind(this));

        BEMDOM.append(this.elem('deposits'), BEMHTML.apply({
            block: 'button',
            mix: { block: 'line', elem: 'button' },
            mods: { theme: 'islands', size: 's', type: 'submit', view: 'action', id: 'backd' },
            text: 'Вернуться'
        }));
        setTimeout(function() {
            this.findBlockInside({ block: 'button', modName: 'id', modVal: 'backd' })
                .on('click', this.onBackClick.bind(this));
        }.bind(this), 500);
    },

    addDep: function(i, e) {
        BEMDOM.append(this.elem('deposits'), BEMHTML.apply({
            block: 'line',
            elem: 'item',
            content: [
                {
                    elem: 'title',
                    content: e.title
                },
                {
                    elem: 'description',
                    content: e.description
                },
                {
                    elem: 'sum',
                    content: 'Начальная сумма: ' + e.minSum + ' BYR'
                }
            ]
        }));
    },

    onBackClick: function() {
        this.delMod('pressed');
        setTimeout(function() {
            this.delMod(this.elem('credits'), 'show');
            this.delMod(this.elem('deposits'), 'show');
        }.bind(this), 500);
    },

    onBackClick2: function() {
        this.onCreditClick();
    },

    onCalc: function(data) {
        this.elem('credits').html('');

        BEMDOM.append(this.elem('credits'), BEMHTML.apply({
            block: 'button',
            mix: { block: 'line', elem: 'button' },
            mods: { theme: 'islands', size: 's', type: 'submit', view: 'action', id: 'back' },
            text: 'Вернуться'
        }));
        setTimeout(function() {
            this.findBlockInside({ block: 'button', modName: 'id', modVal: 'back' })
                .on('click', this.onBackClick2.bind(this));
        }.bind(this), 500);

        BEMDOM.append(this.elem('credits'), BEMHTML.apply({
            block: 'calculator',
            js: {
                data: data
            },
            content: [
                {
                    block: 'group',
                    mix: { block: 'calculator', elem: 'text' },
                    content: 'Согласно выбранному типу: ' + data.title + '<br>'+
                    'Минимальная сумма: ' + data.minSum + ' BYR<br>'+
                    'Максимальная сумма: ' + data.maxSum + ' BYR<br>'+
                    'Срок на кредит: от ' + data.minTerm + ' до ' + data.maxTerm + ' месяца(ев).'
                },
                {
                    block: 'group',
                    content: [
                        {
                            block: 'label',
                            content: 'Тип кредита'
                        },
                        {
                            block: 'select',
                            mods: { mode: 'radio', theme: 'islands', size: 'm' },
                            name: 'select2',
                            val: 1,
                            options: [
                                { val: 1, text: 'дифференцированный' },
                                { val: 2, text: 'аннуитетный' }
                            ]
                        }
                    ]
                },
                {
                    block: 'group',
                    content: [
                        {
                            block: 'label',
                            content: 'Сумма'
                        },
                        {
                            block: 'input',
                            mods: { theme: 'islands', size: 'm', id: 'sum' }
                        }
                    ]
                },
                {
                    block: 'group',
                    content: [
                        {
                            block: 'label',
                            content: 'Дата взятия кредита'
                        },
                        {
                            block: 'input',
                            mods: { theme: 'islands', size: 'm', type: 'date', id: 'creditStart' }
                        },
                    ]
                },
                {
                    block: 'group',
                    content: [
                        {
                            block: 'label',
                            content: 'Дата окончания кредита'
                        },
                        {
                            block: 'input',
                            mods: { theme: 'islands', size: 'm', type: 'date', id: 'creditEnd' }
                        },
                    ]
                },
                {
                    block: 'button',
                    mods: { theme: 'islands', size: 's', type: 'submit', view: 'action', id: 'calc' },
                    text: 'Посчитать'
                },
                {
                    elem: 'result',
                    content: []
                }
            ]
        }));
    }
}));

});
