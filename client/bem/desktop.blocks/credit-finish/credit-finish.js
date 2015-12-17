modules.define('credit-finish', ['i-bem__dom', 'jquery', 'BEMHTML'], function(provide, BEMDOM, $, BEMHTML) {

provide(BEMDOM.decl('credit-finish', {
    onSetMod: {
        'js': function() {
            this.button = this.findBlockInside('button');
            this.plannedSum = this.findBlockInside({ block: 'input', modName: 'id', modVal: 'plannedSum' });
            this.plannedTerm = this.findBlockInside({ block: 'input', modName: 'id', modVal: 'plannedTerm' });

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
            }
        })
        .done(this.onDone.bind(this))
        .fail(this.onFail.bind(this));
    },

    onDone: function(data) {

    },

    onFail: function(data) {

    }

}));

});
