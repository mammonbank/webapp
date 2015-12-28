modules.define('deposit-new', ['i-bem__dom', 'jquery', 'BEMHTML', 'alertifyjs'], function(provide, BEMDOM, $, BEMHTML) {

provide(BEMDOM.decl('deposit-new', {
    onSetMod: {
        'js': function() {
            $.ajax({
                url: BEMDOM.url + 'api/deposit/types/',
                method: 'GET',
                headers: { 'Authorization': localStorage.getItem('token') }
            })
            .done(this.onSuccess.bind(this))
            .fail(this.onFail.bind(this));

            alertify.logPosition("bottom right");
        }
    },

    onSuccess: function(data) {
        this.domElem.html('');

        if (data.depositTypes.length === 0) {
            BEMDOM.append(this.domElem, BEMHTML.apply({
                block: 'info',
                content: 'Ничего не найдено'
            }));
            return;
        }

        $.each(data.depositTypes, this.addItem.bind(this));
    },

    addItem: function(i, data) {
        BEMDOM.append(this.domElem, BEMHTML.apply({
            block: 'deposit-new',
            elem: 'item',
            mix: {
                block: 'deposit-item',
                mods: { id: data.id }
            },
            content: [
                { elem: 'title', content: data.title },
                { elem: 'description', content: data.description },
                { elem: 'minSum', content: data.minSum + ' BYR' },
                {
                    block: 'button',
                    mods: { theme: 'islands', size: 'm', type: 'submit', view: 'action' },
                    text: 'Выбрать'
                }
            ]
        }));
        var item = this.findBlockInside({ block: 'deposit-item', modName: 'id', modVal: data.id });
        item.findBlockInside('button').on('click', this.onClick.bind(this, data.id));
    },

    onClick: function(id) {
        this.domElem.html('');
        this.setMod('type-id', id);

        BEMDOM.append(this.domElem, BEMHTML.apply({
            block: 'deposit-new',
            elem: 'step2',
            content: [
                {
                    elem: 'title',
                    content: 'Подтвердите создание депозита'
                },
                {
                    block: 'group',
                    content: [
                        {
                            elem: 'text',
                            content: 'text:'
                        },
                        {
                            block: 'label',
                            content: 'Первоначальный взнос на депозит:'
                        },
                        {
                            block: 'input',
                            mods: { theme: 'islands', size: 'm', id: 'depositSum' }
                        }
                    ]
                },
                {
                    block: 'button',
                    mix: { block: 'deposit-new', elem: 'create' },
                    mods: { theme: 'islands', size: 'm', type: 'submit', view: 'action' },
                    text: 'Отправить заявку'
                }
            ]
        }));

        this.bindTo('create', 'click', this.onCreate.bind(this));
    },

    onCreate: function() {
        var plannedSum = this.findBlockInside({ block: 'input', modName: 'id', modVal: 'depositSum' }).getVal();

        // валидация

        $.ajax({
            url: BEMDOM.url + 'api/deposit/applications',
            method: 'POST',
            data: { plannedSum: plannedSum, depositTypeId: this.getMod('type-id'), clientId: localStorage.getItem('clientId') },
            headers: { 'Authorization': localStorage.getItem('token') }
        })
        .done(this.onSuccessCreate.bind(this))
        .fail(this.onFailCreate.bind(this));
    },

    onSuccessCreate: function() {
        alertify.success('Заявка успешно отправлена');
        setTimeout(function() {
            this.findBlockOutside('content').setMod('deposit', 'all');
        }.bind(this), 1500)
    },

    onFailCreate: function() {
        alertify.error('Ошибка отправки.');
    },

    onFail: function() {
        alertify.error('Ошибка получения списка депозитов.');
    }
}));
});
