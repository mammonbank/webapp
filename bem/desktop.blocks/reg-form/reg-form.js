modules.define(
    'reg-form',
    ['BEMHTML', 'i-bem__dom', 'jquery', 'moment', 'validator'],
    function(provide, BEMHTML, BEMDOM, $) {

provide(BEMDOM.decl('reg-form', {

    onSetMod : {
        'js': {
            'inited': function() {
                this.step1 = this.findBlockInside('step1');
                this.button = this.step1.findBlockInside('button');
                this.inputs = this.step1.findBlocksInside('input');
                this.qr = this.findBlockInside('qr');

                this.button.on('click', this.onSubmit.bind(this));
            }
        }
    },

    validate: function() {
        validate.extend(validate.validators.datetime, {
          // The value is guaranteed not to be null or undefined but otherwise it
          // could be anything.
          parse: function(value, options) {
            return +moment.utc(value);
          },
          // Input is a unix timestamp
          format: function(value, options) {
            var format = options.dateOnly ? "YYYY-MM-DD" : "YYYY-MM-DD hh:mm:ss";
            return moment.utc(value).format(format);
          }
        });

        var constraints = {
            lastName: {
                presence: { message: '^Обязательное поле' },
                format: {
                    pattern: "^[а-яА-ЯёЁa-z,.'-]+$",
                    flags: "i",
                    message: "Поле может содержать только буквы"
                }
            },
            firstName: {
                presence: { message: '^Обязательное поле' },
                format: {
                    pattern: "^[а-яА-ЯёЁa-z,.'-]+$",
                    flags: "i",
                    message: "^Поле может содержать только буквы"
                }
            },
            patronymic: {
                presence: { message: '^Обязательное поле' },
                format: {
                    pattern: "^[а-яА-ЯёЁa-z,.'-]+$",
                    flags: "i",
                    message: "^Поле может содержать только буквы"
                }
            },
            dateOfBirth: {
                presence: { message: '^Обязательное поле' },
                datetime: {
                    dateOnly: true,
                    earliest: '1900-01-01',
                    latest: Date.now(),
                    message: "^Дата рождения не может быть позже 1900 и раньше сегодняшнего дня"
                }
            },
            phoneNumber: {
                presence: { message: '^Обязательное поле' }
            },
            email: {
                presence: { message: '^Обязательное поле' },
                email: { mesage: "^Введите существующий email" }
            },
            password: {
                presence: { message: '^Обязательное поле' },
                format: {
                    pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[а-яА-ЯёЁa-zA-Z\d]{8,}$",
                    message: "^Пароль должен быть не короче 8 символов и содержать цифру"
                }
            },
            passportNumber: {
                presence: { message: '^Обязательное поле' }
            },
            passportIdNumber: {
                presence: { message: '^Обязательное поле' }
            },
            mothersMaidenName: {
                presence: { message: '^Обязательное поле' },
                format: {
                    pattern: "^[а-яА-ЯёЁa-z,.'-]+$",
                    flags: "i",
                    message: "^Поле может содержать только буквы"
                }
            }
        };

        var isValid = validate({
            lastName: this.inputs[0].getVal(),
            firstName: this.inputs[1].getVal(),
            patronymic: this.inputs[2].getVal(),
            dateOfBirth: this.inputs[3].getVal(),
            phoneNumber: this.inputs[4].getVal(),
            email: this.inputs[5].getVal(),
            password: this.inputs[6].getVal(),
            passportNumber: this.inputs[7].getVal(),
            passportIdNumber: this.inputs[8].getVal(),
            mothersMaidenName: this.inputs[9].getVal(),
        }, constraints);

        if (isValid === undefined) {
            return true;
        }

        var that = this;
        $.each(isValid, function(key, val) {
            var input = that.step1.findBlockInside({ block: 'input', modName: 'id', modVal: key }),
                popup = input.params.popup;

            if (!popup) {
                popup = input.findBlockOutside('line').findBlockInside('popup');
                input.params.popup = popup;
            }

            popup.setContent(isValid[key][0]);
            popup.setAnchor(input);
            popup.setMod('visible', true);
        });

        return false;
    },

    onSubmit: function() {
        if (!this.validate()) { return; }

        $.post(BEMDOM.url + 'api/clients', {
            lastName: this.inputs[0].getVal(),
            firstName: this.inputs[1].getVal(),
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
