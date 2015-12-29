modules.define('calculator', ['i-bem__dom', 'jquery', 'BEMHTML', 'alertifyjs', 'validator', 'moment'], function(provide, BEMDOM, $, BEMHTML) {

provide(BEMDOM.decl('calculator', {
    onSetMod: {
        'js': function() {
            this.init();
        }
    },

    init: function() {
        alertify.logPosition("bottom right");

        this.button = this.findBlockInside({ block: 'button', modName: 'id', modVal: 'calc' });
        this.button.on('click', this.onButton.bind(this));

        this.startDate = this.findBlockInside({ block: 'input', modName: 'id', modVal: 'creditStart' });
        this.endDate = this.findBlockInside({ block: 'input', modName: 'id', modVal: 'creditEnd' });
        this.sum = this.findBlockInside({ block: 'input', modName: 'id', modVal: 'sum' });
        this.cType = this.findBlockInside('select');
    },

    onButton: function() {
        var startDate = this.startDate.getVal(),
            endDate = this.endDate.getVal(),
            sum = parseInt(this.sum.getVal());

        if (startDate === '') {
            alertify.error('Дата взятия кредита не может быть пустой.')
            return;
        }

        if (endDate === '') {
            alertify.error('Дата окончания кредита не может быть пустой.')
            return;
        }

        if (sum === '') {
            alertify.error('Сумма не может быть пустой.')
            return;
        }

        if ((Date.parse(startDate) + 24*3600*1000) < Date.now()) {
            alertify.error('Дата взятия кредита не может быть в прошлом.')
            return;
        }

        if ((Date.parse(endDate) - Date.parse(startDate)) < (this.params.data.minTerm * 30 * 24 * 60 * 60 * 1000)) {
            alertify.error('Срок кредита слишком мал для выбранного типа');
            return;
        }

        if ((Date.parse(endDate) - Date.parse(startDate)) > (this.params.data.maxTerm * 30 * 24 * 60 * 60 * 1000)) {
            alertify.error('Срок кредита слишком большой для выбранного типа');
            return;
        }

        if (sum > this.params.data.maxSum || sum < this.params.data.minSum || sum === undefined || isNaN(sum)) {
            alertify.error('Введите корректную сумму, в диапазоне типа.')
            return;
        }

        var type = this.cType.getVal(),
            cType;
        switch (type) {
            case 1:
                cType = 'diff';
                break;
            case 2:
                cType = 'equal';
                break;
        }

        $.ajax({
            url: BEMDOM.url + 'api/credits/info/payment?' +
            'type=' + cType +
            '&sum=' + sum +
            '&startDate=' + startDate +
            '&endDate=' + endDate +
            '&interest=' + this.params.data.interest +
            '&title=' + this.params.data.title,
            method: 'GET'
        })
        .done(this.onDone.bind(this))
        .fail(this.onFail.bind(this));
    },

    onDone: function(data) {
        this.elem('result').html('');
        this.table = [];
        alertify.success('Расчет завершен');

        $.each(data.payments, this.addResult.bind(this));

        BEMDOM.append(this.elem('result'), BEMHTML.apply({
            block: 'calculator',
            elem: 'table',
            tag: 'table',
            content: [
                {
                    block: 'calculator',
                    elem: 'line',
                    tag: 'tr',
                    content: [
                        {
                            elem: 'line-id',
                            tag: 'th',
                            content: '#'
                        },
                        {
                            elem: 'line-date',
                            tag: 'th',
                            content: 'Дата выплаты'
                        },
                        {
                            elem: 'line-static-fee',
                            tag: 'th',
                            content: 'Основной долг'
                        },
                        {
                            elem: 'line-percent-fee',
                            tag: 'th',
                            content: 'Начисленные проценты'
                        },
                        {
                            elem: 'line-total-fee',
                            tag: 'th',
                            content: 'Сумма платежа'
                        },
                        {
                            elem: 'line-loan',
                            tag: 'th',
                            content: 'Остаток задолженности'
                        }
                    ]
                },
                this.table
            ]
        }));

        BEMDOM.append(this.elem('result'), BEMHTML.apply({
            block: 'calculator',
            elem: 'summury',
            content: [
                {
                    elem: 'text',
                    content: 'общая сумма платежа: ' + data.totalFee + ' BYR'
                },
                {
                    elem: 'text',
                    content: 'общая сумма начисленных процентов: ' + data.totalPercentFee + ' BYR'
                },
                {
                    elem: 'text',
                    content: 'предпочтительный доход: ' + data.preferredIncome + ' BYR'
                }
            ]
        }));
    },

    addResult: function(i, data) {
        this.table.push(BEMHTML.apply({
            block: 'calculator',
            elem: 'line',
            tag: 'tr',
            content: [
                {
                    elem: 'line-id',
                    tag: 'td',
                    content: data.paymentNumber
                },
                {
                    elem: 'line-date',
                    tag: 'td',
                    content: moment(data.paymentDate).format('DD-MM-YYYY')
                },
                {
                    elem: 'line-static-fee',
                    tag: 'td',
                    content: data.staticFee
                },
                {
                    elem: 'line-percent-fee',
                    tag: 'td',
                    content: data.percentFee
                },
                {
                    elem: 'line-total-fee',
                    tag: 'td',
                    content: data.totalFee
                },
                {
                    elem: 'line-loan',
                    tag: 'td',
                    content: data.outstandingLoan
                }
            ]
        }));
    },

    onFail: function(data) {
        console.log(data);
        alertify.error('Ошибка расчета');
        alertify.error(data.message);
    }
}));

});
