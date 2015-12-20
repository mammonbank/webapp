modules.define('credit-finish',
    ['i-bem__dom', 'jquery', 'BEMHTML', 'alertifyjs'],
    function(provide, BEMDOM, $, BEMHTML) {

provide(BEMDOM.decl('credit-finish', {
    onSetMod: {
        'js': function() {
            this.button = this.findBlockInside('button');
            this.plannedSum = this.findBlockInside({ block: 'input', modName: 'id', modVal: 'plannedSum' });
            this.plannedTerm = this.findBlockInside({ block: 'input', modName: 'id', modVal: 'plannedTerm' });
            alertify.logPosition("bottom right");

            this.button.on('click', this.onClick.bind(this));
        }
    },

    onClick: function() {
        // валидация
        this.submit();
    },

    submit: function() {
        $.ajax({
            url: BEMDOM.url + 'api/credit/applications',
            method: 'POST',
            data: {
                plannedSum: this.plannedSum.getVal(),
                plannedTerm: this.plannedTerm.getVal(),
                creditTypeId: this.params.typeId,
                clientId: localStorage.getItem('clientId')
            },
            headers: { 'Authorization': localStorage.getItem('token') }
        })
        .done(this.onDone.bind(this))
        .fail(this.onFail.bind(this));
    },

    onDone: function(data) {
        alertify.success('Заявка успешно отправлена');
        alertify.log('Переадресация на страницу заявок');
        setTimeout(this.redirect.bind(this), 1500);
    },

    redirect: function() {
        this.findBlockOutside('content').setMod('credit', 'all');
    },

    onFail: function(data) {
        alertify.error('Ошибка отправки заявки');
    }

}));

});
