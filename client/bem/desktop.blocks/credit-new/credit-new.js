modules.define('credit-new', ['i-bem__dom', 'jquery', 'BEMHTML', 'alertifyjs'], function(provide, BEMDOM, $, BEMHTML) {

provide(BEMDOM.decl('credit-new', {
    onSetMod: {
        'js': function() {
            this.categories = this.elem('category');
            this.types = this.elem('type');
            this.finish = this.elem('finish');
            alertify.logPosition("bottom right");

            $.ajax({
                url: BEMDOM.url + 'api/credit/categories',
                method: 'GET',
                headers: { 'Authorization': localStorage.getItem('token') }
            })
            .done(this.onCatsSuccess.bind(this))
            .fail(this.onCatsFail.bind(this));
        }
    },

    onCatsSuccess: function(data) {
        var that = this;
        this.creditCats = data.creditCats;

        that.categories.html('');

        if (data.creditCats.length === 0) {
            BEMDOM.append(that.categories, BEMHTML.apply({
                block: 'info',
                content: 'Категорий не найдено'
            }));
            return;
        }

        $.each(this.creditCats, function(i, e) {
            BEMDOM.append(that.categories, BEMHTML.apply({
                block: 'category-item',
                mods: { id: e.id },
                content: e.title
            }));
        });

        this.catItems = this.findBlocksInside('category-item');
        $.each(this.catItems, function(i, e) {
            e.bindTo('click', that.onCatItemClick.bind(that, e));
        });
    },

    onCatsFail: function(data) {
        alertify.error('Ошибка получения категорий');
    },

    onCatItemClick: function(that) {
        var active = this.findBlockInside({ block: 'category-item', modName: 'active', modVal: true });
        if (active) {
            active.delMod('active');
        }

        that.setMod('active');
        $.ajax({
            url: BEMDOM.url + 'api/credit/categories/' + that.getMod('id') + '/credit/types',
            method: 'GET',
            headers: { 'Authorization': localStorage.getItem('token') }
        })
        .done(this.onCatTypesSuccess.bind(this))
        .fail(function(data) {
            alertify.error(data.message);
        });
    },

    onCatTypesSuccess: function(data) {
        var that = this;

        this.delMod(that.types, 'hide');
        that.types.html('');
        that.finish.html('');

        $.each(data.creditTypes, function(i, e) {
            BEMDOM.append(that.types, BEMHTML.apply({
                block: 'type-item',
                mods: { id: e.id },
                js: {
                    typeId: e.id,
                    title: e.title,
                    maxSum: e.maxSum,
                    minSum: e.minSum,
                    interest: e.interest,
                    minTerm: e.minTerm,
                    maxTerm: e.maxTerm
                },
                content: [
                    { elem: 'title', content: e.title },
                    { elem: 'description', content: e.description },
                    { elem: 'interest', content: 'процент: ' + (e.interest*100) + '%' },
                    { elem: 'sum', content: 'сумма: ' + e.minSum + ' - ' + e.maxSum + ' BYR' },
                    { elem: 'time', content: 'срок: ' + e.minTerm + ' - ' + e.maxTerm + ' месяца(ев)' },
                    {
                        block: 'button',
                        mods: { theme: 'islands', size: 'l', type: 'submit', view: 'action' },
                        text: 'Выбрать'
                    }
                ]
            }));
        });
    }
}));

});
