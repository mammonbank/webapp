modules.define(
    'reg-form',
    ['BEMHTML', 'i-bem__dom', 'jquery', 'keyboard__codes', 'moment', 'validator', 'alertifyjs'],
    function(provide, BEMHTML, BEMDOM, $, keyCodes) {

provide(BEMDOM.decl('reg-form', {

    onSetMod : {
        'js': {
            'inited': function() {
                this.step1 = this.findBlockInside('step1');
                this.button = this.step1.findBlockInside('button');
                this.inputs = this.step1.findBlocksInside('input');
                this.qr = this.findBlockInside('qr');

                this.button.on('click', this.onSubmit.bind(this));
                this.bindTo('keydown', this._onKeyDown);

                alertify.logPosition("bottom right");
            }
        }
    },

    _onKeyDown: function(e) {
        if((e.keyCode === keyCodes.ENTER) && !e.shiftKey) {
            this.onSubmit();
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
                presence: { message: '^Поле Фамилия обязательное' },
                format: {
                    pattern: "^[а-яА-ЯёЁa-z,.'-]+$",
                    flags: "i",
                    message: "Поле не может содержать цифры и спец символы"
                }
            },
            firstName: {
                presence: { message: '^Поле Имя обязательное' },
                format: {
                    pattern: "^[а-яА-ЯёЁa-z,.'-]+$",
                    flags: "i",
                    message: "^Поле не может содержать цифры и спец символы"
                }
            },
            patronymic: {
                presence: { message: '^Поле Отчества обязательное' },
                format: {
                    pattern: "^[а-яА-ЯёЁa-z,.'-]+$",
                    flags: "i",
                    message: "^Поле не может содержать цифры и спец символы"
                }
            },
            dateOfBirth: {
                presence: { message: '^Заполните дату рождения' },
                datetime: {
                    dateOnly: true,
                    earliest: '1900-01-01',
                    latest: Date.now() - 18 * 365 * 24 * 3600 * 100,
                    message: "^Вы должны быть старше 18 лет"
                }
            },
            phoneNumber: {
                presence: { message: '^Введите телефон' }
            },
            email: {
                presence: { message: '^Введите почту' },
                email: { mesage: "^Введите существующий email" }
            },
            password: {
                presence: { message: '^Поле Пароль обязательное' },
                format: {
                    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[а-яА-ЯёЁa-zA-Z\d]{8,}$/,
                    message: "^Пароль должен содержать хотя бы одну цифру и заглавную букву"
                },
                length: {
                    minimum: 8,
                    message: "^Пароль должен быть не короче 8 символов"
                }
            },
            passportNumber: {
                presence: { message: '^Введите номер паспорта' },
                format: {
                    pattern: /[a-zA-z]{2}[0-9]{7}$/,
                    message: '^Введите 2 латинские буквы и 7 цифр.'
                }
            },
            passportIdNumber: {
                presence: { message: '^Введите личный (идентификационный) номер' },
                format: {
                    pattern: /[a-zA-Z0-9]{14}$/,
                    message: '^Может содержать только 14 символов.'
                }
            },
            mothersMaidenName: {
                presence: { message: '^Секретная фраза обязательна' },
                format: {
                    pattern: "^[а-яА-ЯёЁa-z,.'-]+$",
                    flags: "i",
                    message: "^Поле не может содержать цифры и спец символы"
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
            // var input = that.step1.findBlockInside({ block: 'input', modName: 'id', modVal: key }),
            //     popup = input.params.popup;

            // if (!popup) {
            //     popup = input.findBlockOutside('line2').findBlockInside('popup');
            //     input.params.popup = popup;
            // }

            // popup.setContent(isValid[key][0]);
            // popup.setAnchor(input);
            // popup.setMod('visible', true);

            alertify.error(isValid[key][0]);
        });

        return false;
    },

    onSubmit: function() {
        if (!this.validate()) { return; }

        $.ajax({
            url: BEMDOM.url + 'api/clients',
            method: 'POST',
            data: {
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
            }
        })
        .done(this.onSuccess.bind(this))
        .fail(this.onFail.bind(this));
    },

    onSuccess: function(data) {
        this.unbindFrom('keydown', this._onKeyDown);

        this.step1.setMod('hide', 'yes');
        this.img = this.qr.findBlockInside('image');
        this.img.domElem.attr('src', data.key.google_auth_qr);
        this.qr.params.clientId = data.clientId;
        this.qr.delMod('hide');
        this.qr.setMod('show', 'yes');
    },

    onFail: function(data) {
        console.log(data);
        alertify.error(data.responseJSON.message);
        // modal + data.message
    }
}));

});
