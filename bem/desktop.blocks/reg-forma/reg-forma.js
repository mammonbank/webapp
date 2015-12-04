modules.define('reg-forma', ['i-bem__dom', 'jquery'], function(provide, BEMDOM, $) {

provide(BEMDOM.decl('reg-forma', {

    onSetMod : {
        'js': {
            'inited': function() {
                this.step1 = this.findBlockInside('step1');
                this.button = this.step1.findBlockInside('button');
                this.inputs = this.step1.findBlocksInside('input');
                this.qr = this.findBlockInside('qr');
                console.log(this.step1);

                this.button.on('click', this.onSubmit.bind(this));
            }
        }
    },

    onSubmit: function() {
        console.log('submit');
        $.post('//localhost:3000/api/clients', {
            firstName: this.inputs[0].getVal(),
            lastName: this.inputs[1].getVal(),
            patronymic: this.inputs[2].getVal(),
            dateOfBirth: this.inputs[3].getVal(),
            phoneNumber: this.inputs[4].getVal(),
            email: this.inputs[5].getVal(),
            password: this.inputs[6].getVal(),
            passportNumber: this.inputs[7].getVal(),
            passportIdNumber: this.inputs[8].getVal(),
            mothersMaidenName: this.inputs[9].getVal(),
        }, this.onSuccess.bind(this));
    },

    onSuccess: function(data) {
        this.step1.setMod('hide', 'yes');
        this.img = this.qr.findBlockInside('image');
        this.img.domElem.attr('src', data.key.google_auth_qr);
        this.qr.params.clientId = data.clientId;
        this.qr.delMod('hide');
    }
}));

});
