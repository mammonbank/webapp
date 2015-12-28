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
                },
                {
                    block: 'link',
                    url: '/signup',
                    mix: { block: 'header', elem: 'signup' },
                    content: 'Регистрация'
                },
                {
                    block: 'link',
                    url: '/dashboard',
                    mix: { block: 'header', elem: 'dashboard' },
                    content: 'Личный кабинет'
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
            js: true,
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
                            content: 'Наш банк предлагает самые выгодные кредиты на хороших условиях<br><br>' +
                            'Вы так же можете воспользоваться онлайн калькулятором кредитов, выбрав нужный тип.'
                        },
                        {
                            elem: 'button',
                            content: {
                                block: 'button',
                                mods: { theme: 'islands', size: 'm', type: 'submit', view: 'action', id: 'credit' },
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
                            content: 'Наш банк предлагает самые выгодные депозиты на хороших условиях'
                        },
                        {
                            elem: 'button',
                            content: {
                                block: 'button',
                                mods: { theme: 'islands', size: 'm', type: 'submit', view: 'action', id: 'deposit' },
                                text: 'Посмотреть'
                            }
                        }
                    ]
                },
                {
                    elem: 'credits',
                    content: []
                },
                {
                    elem: 'deposits',
                    content: []
                }
            ]
        }
    ]
};
