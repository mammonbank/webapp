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
            js: true,
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
                            block: 'input',
                            mods: { theme: 'islands', size: 'm' },
                            placeholder: 'Фамилия'
                        },
                        {
                            block : 'input',
                            mods : { theme : 'islands', size : 'm' },
                            placeholder : 'Имя'
                        },
                        {
                            block: 'input',
                            mods: { theme: 'islands', size: 'm' },
                            placeholder: 'Отчество'
                        },
                        {
                            block: 'input',
                            mods: { theme: 'islands', size: 'm', type: 'date' },
                            placeholder: 'Дата рождения'
                        },
                        {
                            block: 'input',
                            mods: { theme: 'islands', size: 'm' },
                            placeholder: 'Номер телефона'
                        },
                        {
                            block: 'input',
                            mods: { theme: 'islands', size: 'm' },
                            placeholder: 'Почта (email)'
                        },
                        {
                            block: 'input',
                            mods: { theme: 'islands', size: 'm', type: 'password' },
                            placeholder: 'Пароль'
                        },
                        {
                            block: 'input',
                            mods: { theme: 'islands', size: 'm' },
                            placeholder: 'Номер пасспорта'
                        },
                        {
                            block: 'input',
                            mods: { theme: 'islands', size: 'm' },
                            placeholder: 'Личный (идентификационный) номер'
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
                            placeholder: 'Введите пароль с телефона'
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
