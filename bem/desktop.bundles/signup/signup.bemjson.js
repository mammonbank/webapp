module.exports = {
    block: 'page',
    title: 'signup',
    head: [
        { elem: 'css', url: 'signup.min.css' }
    ],
    scripts: [{ elem: 'js', url: 'signup.min.js' }],
    content: [
        {
            block: 'header',
            content: [
                {
                }
            ]
        },
        {
            block: 'reg-forma',
            js: true,
            content: [
                {
                    block: 'step1',
                    content: [
                        {
                            block : 'input',
                            mods : { theme : 'islands', size : 'm' },
                            placeholder : 'Введите имя'
                        },
                        {
                            block: 'input',
                            mods: { theme: 'islands', size: 'm' },
                            placeholder: 'Введите фамилию'
                        },
                        {
                            block: 'input',
                            mods: { theme: 'islands', size: 'm' },
                            placeholder: 'Введите отчество'
                        },
                        {
                            block: 'input',
                            mods: { theme: 'islands', size: 'm', type: 'date' },
                            placeholder: 'Введите дату рождения'
                        },
                        {
                            block: 'input',
                            mods: { theme: 'islands', size: 'm' },
                            placeholder: 'Введите номер телефона'
                        },
                        {
                            block: 'input',
                            mods: { theme: 'islands', size: 'm' },
                            placeholder: 'Email'
                        },
                        {
                            block: 'input',
                            mods: { theme: 'islands', size: 'm', type: 'password' },
                            placeholder: 'Password'
                        },
                        {
                            block: 'input',
                            mods: { theme: 'islands', size: 'm' },
                            placeholder: 'Номер пасспорта'
                        },
                        {
                            block: 'input',
                            mods: { theme: 'islands', size: 'm' },
                            placeholder: 'Id пасспорта'
                        },
                        {
                            block: 'input',
                            mods: { theme: 'islands', size: 'm' },
                            placeholder: 'Девичья фамилия матери'
                        },
                        {
                            block: 'button',
                            mods : { theme : 'islands', size : 'm', type : 'submit' },
                            text: 'Зарегистрироваться'
                        }
                    ]
                },
                {
                    block: 'qr',
                    js: true,
                    mods: { hide: 'yes' },
                    content: [
                        {
                            block: 'image',
                            url: ''
                        },
                        {
                            block: 'input',
                            mods: { theme: 'islands', size: 'm' },
                            placeholder: 'One time password'
                        },
                        {
                            block: 'button',
                            mods : { theme : 'islands', size : 'm', type : 'submit' },
                            text: 'Отправить'
                        }
                    ]
                }
            ]
        }
    ]
};
