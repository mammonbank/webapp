modules.define('credit-finish',
    ['i-bem__dom', 'jquery', 'BEMHTML', 'alertifyjs'],
    function(provide, BEMDOM, $, BEMHTML) {

provide(BEMDOM.decl('credit-finish', {
    onSetMod: {
        'js': function() {
            this.button = this.findBlockInside({ block: 'button', modName: 'view', modVal: 'action' });
            this.plannedSum = this.findBlockInside({ block: 'input', modName: 'id', modVal: 'plannedSum' });
            this.plannedTerm = this.findBlockInside({ block: 'input', modName: 'id', modVal: 'plannedTerm' });
            this.cType = this.findBlockInside('select');
            alertify.logPosition("bottom right");

            this.button.on('click', this.onClick.bind(this));
        }
    },

    onClick: function() {
        this.sum = parseInt(this.plannedSum.getVal());
        this.term = parseInt(this.plannedTerm.getVal());
        if (this.sum > this.params.maxSum || this.sum < this.params.minSum || isNaN(this.sum)) {
            alertify.error('Неверное значение суммы');
            return;
        }

        if (this.term < this.params.minTerm || this.term > this.params.maxTerm || isNaN(this.term)) {
            alertify.error('Неверное значение срока');
            return;
        }
        // валидация
        this.button.setMod('disabled');
        this.submit();
    },

    submit: function() {
        var cType = 'DIFF';
        if (this.cType === 2) {
            cType = 'EQUAL';
        }

        $.ajax({
            url: BEMDOM.url + 'api/credit/applications',
            method: 'POST',
            data: {
                plannedSum: this.sum,
                plannedTerm: this.term,
                creditTypeId: this.params.typeId,
                clientId: localStorage.getItem('clientId'),
                repaymentType: cType
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
        this.button.delMod('disabled');
        alertify.error('Ошибка отправки заявки');
        if (data.responseJSON) {
            alertify.error(data.responseJSON.message);
        }
    }

}));

});
