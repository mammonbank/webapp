module.exports = {
    block: 'page',
    title: 'index',
    head: [
        { elem: 'css', url: 'index/index.min.css' }
    ],
    scripts: [{ elem: 'js', url: 'index/index.min.js' }, { elem: 'js', url: 'index/index.bemhtml.js' }],
    content: [
        {
            block: 'header',
            js: true,
            content: [
                {
                    block: 'link',
                    url: '/',
                    content: {
                        block: 'header',
                        elem: 'logo',
                        content: 'Mammonbank'
                    }
                }
            ]
        },
        {
            block: 'main-promo',
            content: [
                'Добро пожаловать!'
            ]
        },
        {
            block: 'line',
            content: [
                {
                    block: 'box',
                    content: [
                        {
                            elem: 'title',
                            content: 'Кредиты'
                        },
                        {
                            elem: 'info',
                            content: 'Наш банк предлагает самые выгодные кредиты на хороших условиях<br>' +
                            'Наш банк предлагает самые выгодные кредиты на хороших условиях<br>'
                        },
                        {
                            elem: 'button',
                            content: {
                                block: 'button',
                                mods: { theme: 'islands', size: 'm', type: 'submit', view: 'action' },
                                text: 'Посмотреть'
                            }
                        }
                    ]
                },
                {
                    block: 'box',
                    content: [
                        {
                            elem: 'title',
                            content: 'Депозиты'
                        },
                        {
                            elem: 'info',
                            content: 'Наш банк предлагает самые выгодные кредиты на хороших условиях<br>' +
                            'Наш банк предлагает самые выгодные кредиты на хороших условиях<br>'
                        },
                        {
                            elem: 'button',
                            content: {
                                block: 'button',
                                mods: { theme: 'islands', size: 'm', type: 'submit', view: 'action' },
                                text: 'Посмотреть'
                            }
                        }
                    ]
                },
                {
                    block: 'box',
                    content: [
                        {
                            elem: 'title',
                            content: 'Кредитный калькулятор'
                        },
                        {
                            elem: 'info',
                            content: 'Наш банк предлагает самые выгодные кредиты на хороших условиях<br>' +
                            'Наш банк предлагает самые выгодные кредиты на хороших условиях<br>'
                        },
                        {
                            elem: 'button',
                            content: {
                                block: 'button',
                                mods: { theme: 'islands', size: 'm', type: 'submit', view: 'action' },
                                text: 'Посмотреть'
                            }
                        }
                    ]
                }
            ]
        },
        {
            block: 'line',
            js: true,
            content: [
                {
                    block: 'box',
                    content: [
                        {
                            elem: 'title',
                            content: 'Регистрация'
                        },
                        {
                            elem: 'button',
                            content: {
                                block: 'button',
                                mods: { theme: 'islands', size: 'l', type: 'submit', view: 'action', id: 'signup' },
                                text: 'Зарегистрироваться'
                            }
                        }
                    ]
                },
                {
                    block: 'box',
                    content: [
                        {
                            elem: 'title',
                            content: 'Личный кабинет'
                        },
                        {
                            elem: 'button',
                            content: {
                                block: 'button',
                                mods: { theme: 'islands', size: 'l', type: 'submit', view: 'action', id: 'signin' },
                                text: 'Войти'
                            }
                        }
                    ]
                }
            ]
        }

    ]
};
